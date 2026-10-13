"""Integration tests for admin authentication and admin category CRUD.

Covers:
- POST /api/auth/admin with correct/incorrect/staff password (AC-051, AC-052, AC-053)
- GET /api/admin/categories (requires valid admin token)
- POST /api/admin/categories (AC-039)
- PUT /api/admin/categories/{id} (AC-040)
- DELETE /api/admin/categories/{id} with and without items (AC-041, 409 constraint)
- All admin category endpoints return 401 without a valid admin token
- Existing /health and GET /api/menu still pass
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import auth
from app.database import SessionLocal
from app.main import app
from app.models import Category, MenuItem

client = TestClient(app)

ADMIN_PASSWORD = auth.ADMIN_PASSWORD
STAFF_PASSWORD = auth.STAFF_PASSWORD


# ── Helpers ───────────────────────────────────────────────────────────────


def _admin_token() -> str:
    """Obtain a valid admin token."""
    response = client.post("/api/auth/admin", json={"password": ADMIN_PASSWORD})
    assert response.status_code == 200
    return response.json()["access_token"]


def _admin_headers() -> dict[str, str]:
    """Return Authorization headers with a valid admin token."""
    return {"Authorization": f"Bearer {_admin_token()}"}


def _staff_token() -> str:
    """Obtain a valid staff token."""
    response = client.post("/api/auth/staff", json={"password": STAFF_PASSWORD})
    assert response.status_code == 200
    return response.json()["access_token"]


def _cleanup_category(session: Session, category_id: int) -> None:
    """Delete a category and its items if it still exists."""
    cat = session.get(Category, category_id)
    if cat is not None:
        session.delete(cat)
    session.commit()


# ── AC-051: POST /api/auth/admin with correct password returns 200 with token


def test_admin_login_correct_password_returns_200() -> None:
    """Correct admin password must return 200 with a token."""
    response = client.post("/api/auth/admin", json={"password": ADMIN_PASSWORD})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert isinstance(data["access_token"], str)
    assert len(data["access_token"]) > 0
    assert data["token_type"] == "bearer"


# ── AC-052: POST /api/auth/admin with incorrect password returns 401


def test_admin_login_incorrect_password_returns_401() -> None:
    """Incorrect password must return 401 with an error detail."""
    response = client.post("/api/auth/admin", json={"password": "wrong-password"})

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], str)
    assert len(data["detail"]) > 0


# ── AC-053: POST /api/auth/admin with staff password returns 401


def test_admin_login_staff_password_returns_401() -> None:
    """Staff password must not grant admin access."""
    response = client.post("/api/auth/admin", json={"password": STAFF_PASSWORD})

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], str)


# ── All admin category endpoints return 401 without a valid admin token ──


def test_get_categories_without_token_returns_401() -> None:
    """GET /api/admin/categories without a token must return 401."""
    response = client.get("/api/admin/categories")
    assert response.status_code == 401


def test_post_category_without_token_returns_401() -> None:
    """POST /api/admin/categories without a token must return 401."""
    response = client.post("/api/admin/categories", json={"name": "Test"})
    assert response.status_code == 401


def test_put_category_without_token_returns_401() -> None:
    """PUT /api/admin/categories/{id} without a token must return 401."""
    response = client.put("/api/admin/categories/1", json={"name": "Test"})
    assert response.status_code == 401


def test_delete_category_without_token_returns_401() -> None:
    """DELETE /api/admin/categories/{id} without a token must return 401."""
    response = client.delete("/api/admin/categories/1")
    assert response.status_code == 401


def test_get_categories_with_staff_token_returns_401() -> None:
    """A staff token must not work on admin endpoints."""
    staff_token = _staff_token()
    response = client.get(
        "/api/admin/categories",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 401


def test_get_categories_with_invalid_token_returns_401() -> None:
    """An invalid/garbage token must return 401."""
    response = client.get(
        "/api/admin/categories",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401


# ── GET /api/admin/categories returns all categories ──────────────────────


def test_get_categories_returns_all_with_valid_token() -> None:
    """GET /api/admin/categories with a valid admin token returns 200 and a list."""
    response = client.get("/api/admin/categories", headers=_admin_headers())

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3  # seed data has at least 3 categories
    for cat in data:
        assert isinstance(cat["id"], int)
        assert isinstance(cat["name"], str)
        assert "display_order" in cat


# ── AC-039: POST /api/admin/categories creates and returns new category ───


def test_create_category_returns_201() -> None:
    """POST /api/admin/categories with a name creates and returns the category."""
    response = client.post(
        "/api/admin/categories",
        json={"name": "Test Created Category"},
        headers=_admin_headers(),
    )

    assert response.status_code == 201
    data = response.json()
    assert isinstance(data["id"], int)
    assert data["name"] == "Test Created Category"
    assert "display_order" in data

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_category(session, data["id"])
    finally:
        session.close()


def test_create_category_appears_in_list() -> None:
    """A newly created category must appear in the list of all categories."""
    create_response = client.post(
        "/api/admin/categories",
        json={"name": "Verify In List"},
        headers=_admin_headers(),
    )
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]

    list_response = client.get("/api/admin/categories", headers=_admin_headers())
    assert list_response.status_code == 200
    ids = [cat["id"] for cat in list_response.json()]
    assert created_id in ids

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_category(session, created_id)
    finally:
        session.close()


# ── AC-040: PUT /api/admin/categories/{id} updates and returns category ───


def test_update_category_returns_200() -> None:
    """PUT /api/admin/categories/{id} with a name updates and returns the category."""
    # Create a category to update
    create_response = client.post(
        "/api/admin/categories",
        json={"name": "Before Update"},
        headers=_admin_headers(),
    )
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]

    # Update it
    update_response = client.put(
        f"/api/admin/categories/{created_id}",
        json={"name": "After Update"},
        headers=_admin_headers(),
    )

    assert update_response.status_code == 200
    data = update_response.json()
    assert data["id"] == created_id
    assert data["name"] == "After Update"

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_category(session, created_id)
    finally:
        session.close()


def test_update_category_not_found_returns_404() -> None:
    """PUT on a non-existent category must return 404."""
    response = client.put(
        "/api/admin/categories/999999",
        json={"name": "Nonexistent"},
        headers=_admin_headers(),
    )
    assert response.status_code == 404


# ── AC-041: DELETE /api/admin/categories/{id} with no items returns 204 ───


def test_delete_category_without_items_returns_204() -> None:
    """DELETE on a category with no items assigned must return 204."""
    # Create a category with no items
    create_response = client.post(
        "/api/admin/categories",
        json={"name": "To Be Deleted"},
        headers=_admin_headers(),
    )
    assert create_response.status_code == 201
    created_id = create_response.json()["id"]

    # Delete it
    delete_response = client.delete(
        f"/api/admin/categories/{created_id}",
        headers=_admin_headers(),
    )
    assert delete_response.status_code == 204

    # Verify it is gone
    session: Session = SessionLocal()
    try:
        cat = session.get(Category, created_id)
        assert cat is None
    finally:
        session.close()


def test_delete_category_with_items_returns_409() -> None:
    """DELETE on a category with items assigned must return 409."""
    session: Session = SessionLocal()
    created_category = None
    created_item = None
    try:
        # Create a category with an item
        cat = Category(name="Has Items", display_order=100)
        session.add(cat)
        session.flush()
        created_category = cat

        item = MenuItem(
            category_id=cat.id,
            name="Some Item",
            description="Test item",
            price=1.00,
            image_url=None,
            is_available=True,
        )
        session.add(item)
        session.commit()
        created_item = item

        # Attempt to delete — should fail with 409
        delete_response = client.delete(
            f"/api/admin/categories/{cat.id}",
            headers=_admin_headers(),
        )
        assert delete_response.status_code == 409
        data = delete_response.json()
        assert "detail" in data
        assert isinstance(data["detail"], str)
        assert len(data["detail"]) > 0

        # Verify the category still exists
        still_exists = session.get(Category, cat.id)
        assert still_exists is not None
    finally:
        if created_item is not None:
            item_obj = session.get(MenuItem, created_item.id)
            if item_obj is not None:
                session.delete(item_obj)
        if created_category is not None:
            cat_obj = session.get(Category, created_category.id)
            if cat_obj is not None:
                session.delete(cat_obj)
        session.commit()
        session.close()


def test_delete_category_not_found_returns_404() -> None:
    """DELETE on a non-existent category must return 404."""
    response = client.delete(
        "/api/admin/categories/999999",
        headers=_admin_headers(),
    )
    assert response.status_code == 404


# ── Existing endpoints still pass ─────────────────────────────────────────


def test_health_still_passes() -> None:
    """The /health endpoint must still return 200."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_menu_still_passes() -> None:
    """The GET /api/menu endpoint must still return 200 with a list."""
    response = client.get("/api/menu")
    assert response.status_code == 200
    assert isinstance(response.json(), list)