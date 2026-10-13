"""Integration tests for admin menu item CRUD endpoints.

Covers:
- GET /api/admin/items returns all items with admin token
- POST /api/admin/items creates an item with all fields (AC-042)
- POST /api/admin/items without image_url saves null (AC-043)
- POST /api/admin/items validation failures: name, price, category_id (AC-046)
- PUT /api/admin/items/{id} updates item fields (AC-044)
- DELETE /api/admin/items/{id} deletes the item (AC-045)
- Auth boundaries: no token, staff token, invalid token → 401
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import auth
from app.database import SessionLocal
from app.main import app
from app.models import MenuItem

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


def _staff_headers() -> dict[str, str]:
    """Return Authorization headers with a valid staff token."""
    return {"Authorization": f"Bearer {_staff_token()}"}


def _create_item(name: str = "Test Item", **overrides) -> dict:
    """Create a menu item via POST and return the parsed JSON body."""
    payload: dict = {
        "name": name,
        "description": "A test item",
        "price": 4.50,
        "category_id": 1,
    }
    payload.update(overrides)
    response = client.post("/api/admin/items", headers=_admin_headers(), json=payload)
    assert response.status_code == 201, response.text
    return response.json()


def _cleanup_item(session: Session, item_id: int) -> None:
    """Delete a menu item if it still exists."""
    item = session.get(MenuItem, item_id)
    if item is not None:
        session.delete(item)
    session.commit()


# ── Auth boundaries: all protected endpoints return 401 without a token ───


def test_list_items_without_token_returns_401() -> None:
    """GET /api/admin/items without a token must return 401."""
    response = client.get("/api/admin/items")
    assert response.status_code == 401


def test_list_items_with_staff_token_returns_401() -> None:
    """A staff token must not work on admin item endpoints."""
    response = client.get("/api/admin/items", headers=_staff_headers())
    assert response.status_code == 401


def test_list_items_with_invalid_token_returns_401() -> None:
    """An invalid/garbage token must return 401."""
    response = client.get(
        "/api/admin/items",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401


def test_create_item_without_token_returns_401() -> None:
    """POST /api/admin/items without a token must return 401."""
    response = client.post(
        "/api/admin/items",
        json={"name": "Test", "price": 3.00, "category_id": 1},
    )
    assert response.status_code == 401


def test_create_item_with_staff_token_returns_401() -> None:
    """POST /api/admin/items with a staff token must return 401."""
    response = client.post(
        "/api/admin/items",
        headers=_staff_headers(),
        json={"name": "Test", "price": 3.00, "category_id": 1},
    )
    assert response.status_code == 401


def test_update_item_without_token_returns_401() -> None:
    """PUT /api/admin/items/{id} without a token must return 401."""
    response = client.put("/api/admin/items/1", json={"name": "Test"})
    assert response.status_code == 401


def test_delete_item_without_token_returns_401() -> None:
    """DELETE /api/admin/items/{id} without a token must return 401."""
    response = client.delete("/api/admin/items/1")
    assert response.status_code == 401


# ── GET /api/admin/items returns all items with admin token ───────────────


def test_list_items_returns_all_with_admin_token() -> None:
    """GET /api/admin/items with a valid admin token returns 200 and all items."""
    response = client.get("/api/admin/items", headers=_admin_headers())

    assert response.status_code == 200
    items = response.json()
    assert isinstance(items, list)
    assert len(items) >= 10  # seed data provides 11 items
    for item in items:
        assert isinstance(item["id"], int)
        assert isinstance(item["category_id"], int)
        assert isinstance(item["name"], str)
        assert item["description"] is None or isinstance(item["description"], str)
        assert isinstance(item["price"], (int, float))
        assert item["image_url"] is None or isinstance(item["image_url"], str)
        assert isinstance(item["is_available"], bool)


# ── AC-042: POST /api/admin/items creates an item with all fields ─────────


def test_create_item_with_all_fields_returns_201() -> None:
    """POST with all required fields returns 201 and the created item."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "Flat White",
            "description": "Smooth espresso with steamed milk",
            "price": 4.50,
            "category_id": 1,
        },
    )
    assert response.status_code == 201
    item = response.json()
    assert item["name"] == "Flat White"
    assert item["description"] == "Smooth espresso with steamed milk"
    assert float(item["price"]) == 4.50
    assert item["category_id"] == 1
    assert item["image_url"] is None
    assert item["is_available"] is True
    assert isinstance(item["id"], int)

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_item(session, item["id"])
    finally:
        session.close()


def test_create_item_with_image_url() -> None:
    """POST with an explicit image_url stores the provided URL."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "Mocha",
            "description": "Chocolate espresso drink",
            "price": 5.00,
            "category_id": 1,
            "image_url": "https://example.com/mocha.jpg",
        },
    )
    assert response.status_code == 201
    assert response.json()["image_url"] == "https://example.com/mocha.jpg"

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_item(session, response.json()["id"])
    finally:
        session.close()


# ── AC-043: POST /api/admin/items without image_url saves null ────────────


def test_create_item_without_image_url_saves_null() -> None:
    """POST omitting image_url stores null and still creates the item."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "Drip Coffee",
            "description": "Classic drip",
            "price": 2.50,
            "category_id": 1,
        },
    )
    assert response.status_code == 201
    assert response.json()["image_url"] is None

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_item(session, response.json()["id"])
    finally:
        session.close()


def test_create_item_with_null_image_url_stores_null() -> None:
    """POST with image_url explicitly null stores null."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "Pour Over",
            "description": "Hand poured",
            "price": 3.75,
            "category_id": 1,
            "image_url": None,
        },
    )
    assert response.status_code == 201
    assert response.json()["image_url"] is None

    # Cleanup
    session: Session = SessionLocal()
    try:
        _cleanup_item(session, response.json()["id"])
    finally:
        session.close()


# ── AC-046: POST /api/admin/items validation failures return 422 ──────────


def test_create_item_without_name_returns_422() -> None:
    """POST without name returns 422 with a validation error for name."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "description": "No name item",
            "price": 3.00,
            "category_id": 1,
        },
    )
    assert response.status_code == 422
    detail = response.json()["detail"]
    assert isinstance(detail, list)
    assert any("name" in str(d.get("loc", [])) for d in detail)


def test_create_item_without_price_returns_422() -> None:
    """POST without price returns 422 with a validation error for price."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "Free Coffee",
            "description": "No price",
            "category_id": 1,
        },
    )
    assert response.status_code == 422
    detail = response.json()["detail"]
    assert isinstance(detail, list)
    assert any("price" in str(d.get("loc", [])) for d in detail)


def test_create_item_without_category_id_returns_422() -> None:
    """POST without category_id returns 422 with a validation error."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "No Category Item",
            "description": "No category",
            "price": 3.00,
        },
    )
    assert response.status_code == 422
    detail = response.json()["detail"]
    assert isinstance(detail, list)
    assert any("category_id" in str(d.get("loc", [])) for d in detail)


def test_create_item_with_nonexistent_category_returns_422() -> None:
    """POST with a category_id that does not exist returns 422."""
    response = client.post(
        "/api/admin/items",
        headers=_admin_headers(),
        json={
            "name": "Ghost Item",
            "description": "Bad category",
            "price": 3.00,
            "category_id": 99999,
        },
    )
    assert response.status_code == 422


# ── AC-044: PUT /api/admin/items/{id} updates item fields ─────────────────


def test_update_item_partial_fields_returns_200() -> None:
    """PUT updates only the provided fields and returns the updated item."""
    item = _create_item("Update Target")
    item_id = item["id"]

    try:
        response = client.put(
            f"/api/admin/items/{item_id}",
            headers=_admin_headers(),
            json={"name": "Renamed Item", "price": 6.99},
        )
        assert response.status_code == 200
        updated = response.json()
        assert updated["id"] == item_id
        assert updated["name"] == "Renamed Item"
        assert float(updated["price"]) == 6.99
        # Unchanged fields keep their original values
        assert updated["description"] == "A test item"
        assert updated["category_id"] == 1
        assert updated["is_available"] is True
    finally:
        session: Session = SessionLocal()
        try:
            _cleanup_item(session, item_id)
        finally:
            session.close()


def test_update_item_all_fields_returns_200() -> None:
    """PUT can update every field at once."""
    item = _create_item("Full Update Target")
    item_id = item["id"]

    try:
        response = client.put(
            f"/api/admin/items/{item_id}",
            headers=_admin_headers(),
            json={
                "name": "Fully Updated",
                "description": "New description",
                "price": 7.50,
                "category_id": 2,
                "image_url": "https://example.com/updated.jpg",
                "is_available": False,
            },
        )
        assert response.status_code == 200
        updated = response.json()
        assert updated["name"] == "Fully Updated"
        assert updated["description"] == "New description"
        assert float(updated["price"]) == 7.50
        assert updated["category_id"] == 2
        assert updated["image_url"] == "https://example.com/updated.jpg"
        assert updated["is_available"] is False
    finally:
        session: Session = SessionLocal()
        try:
            _cleanup_item(session, item_id)
        finally:
            session.close()


def test_update_item_not_found_returns_404() -> None:
    """PUT on a non-existent item returns 404."""
    response = client.put(
        "/api/admin/items/99999",
        headers=_admin_headers(),
        json={"name": "Does Not Exist"},
    )
    assert response.status_code == 404


# ── AC-045: DELETE /api/admin/items/{id} deletes the item ─────────────────


def test_delete_item_returns_204() -> None:
    """DELETE removes the item and returns 204."""
    item = _create_item("Delete Target")
    item_id = item["id"]

    response = client.delete(f"/api/admin/items/{item_id}", headers=_admin_headers())
    assert response.status_code == 204

    # Confirm the item no longer appears in the list
    listing = client.get("/api/admin/items", headers=_admin_headers())
    ids = [i["id"] for i in listing.json()]
    assert item_id not in ids


def test_delete_item_not_found_returns_404() -> None:
    """DELETE on a non-existent item returns 404."""
    response = client.delete("/api/admin/items/99999", headers=_admin_headers())
    assert response.status_code == 404