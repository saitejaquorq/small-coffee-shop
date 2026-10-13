"""Tests for admin menu item CRUD endpoints (GET/POST/PUT/DELETE /api/admin/items).

These tests exercise the full request/response cycle through the FastAPI
TestClient against the real application, which creates tables and seeds data on
import of ``app.main``.
"""

from fastapi.testclient import TestClient

from app.auth import create_token
from app.main import app

client = TestClient(app)


# ── Helpers ───────────────────────────────────────────────────────────────


def _admin_headers() -> dict[str, str]:
    """Return headers carrying a valid admin JWT."""
    return {"Authorization": f"Bearer {create_token('admin')}"}


def _staff_headers() -> dict[str, str]:
    """Return headers carrying a staff JWT (wrong role for admin endpoints)."""
    return {"Authorization": f"Bearer {create_token('staff')}"}


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


# ── GET /api/admin/items ──────────────────────────────────────────────────


def test_list_items_requires_admin_token() -> None:
    """GET without a token must return 401."""
    response = client.get("/api/admin/items")
    assert response.status_code == 401


def test_list_items_rejects_staff_token() -> None:
    """GET with a staff (non-admin) token must return 401."""
    response = client.get("/api/admin/items", headers=_staff_headers())
    assert response.status_code == 401


def test_list_items_returns_all_with_required_fields() -> None:
    """GET with a valid admin token returns 200 and items with all fields."""
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


# ── POST /api/admin/items ─────────────────────────────────────────────────


def test_create_item_success() -> None:
    """POST with all required fields returns 201 and the created item (AC-042)."""
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


def test_create_item_with_image_url() -> None:
    """POST with image_url stores the provided URL."""
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


def test_create_item_without_image_url_stores_null() -> None:
    """POST omitting image_url stores null and still creates the item (AC-043)."""
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


def test_create_item_without_name_returns_422() -> None:
    """POST without name returns 422 with a validation error for name (AC-046)."""
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
    """POST without price returns 422 with a validation error for price (AC-046)."""
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
    """POST without category_id returns 422 with validation error (AC-046)."""
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


def test_create_item_requires_admin_token() -> None:
    """POST without a valid admin token returns 401."""
    response = client.post(
        "/api/admin/items",
        json={
            "name": "No Auth Item",
            "description": "Test",
            "price": 3.00,
            "category_id": 1,
        },
    )
    assert response.status_code == 401


def test_create_item_rejects_staff_token() -> None:
    """POST with a staff token (wrong role) returns 401."""
    response = client.post(
        "/api/admin/items",
        headers=_staff_headers(),
        json={
            "name": "Staff Item",
            "description": "Test",
            "price": 3.00,
            "category_id": 1,
        },
    )
    assert response.status_code == 401


# ── PUT /api/admin/items/{id} ─────────────────────────────────────────────


def test_update_item_partial_fields() -> None:
    """PUT updates only the provided fields and returns the updated item (AC-044)."""
    item = _create_item("Update Target")
    item_id = item["id"]

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


def test_update_item_all_fields() -> None:
    """PUT can update every field at once."""
    item = _create_item("Full Update Target")
    item_id = item["id"]

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


def test_update_item_not_found() -> None:
    """PUT on a non-existent item returns 404."""
    response = client.put(
        "/api/admin/items/99999",
        headers=_admin_headers(),
        json={"name": "Does Not Exist"},
    )
    assert response.status_code == 404


def test_update_item_requires_admin_token() -> None:
    """PUT without a valid admin token returns 401."""
    response = client.put(
        "/api/admin/items/1",
        json={"name": "No Auth Update"},
    )
    assert response.status_code == 401


# ── DELETE /api/admin/items/{id} ──────────────────────────────────────────


def test_delete_item_returns_204() -> None:
    """DELETE removes the item and returns 204 (AC-045)."""
    item = _create_item("Delete Target")
    item_id = item["id"]

    response = client.delete(f"/api/admin/items/{item_id}", headers=_admin_headers())
    assert response.status_code == 204

    # Confirm the item no longer appears in the list
    listing = client.get("/api/admin/items", headers=_admin_headers())
    ids = [i["id"] for i in listing.json()]
    assert item_id not in ids


def test_delete_item_not_found() -> None:
    """DELETE on a non-existent item returns 404."""
    response = client.delete("/api/admin/items/99999", headers=_admin_headers())
    assert response.status_code == 404


def test_delete_item_requires_admin_token() -> None:
    """DELETE without a valid admin token returns 401."""
    response = client.delete("/api/admin/items/1")
    assert response.status_code == 401
