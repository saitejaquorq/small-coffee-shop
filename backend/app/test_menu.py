"""Integration tests for the public GET /api/menu endpoint.

These tests use the FastAPI TestClient against the real application, which
creates tables and seeds data on import of ``app.main``. The database is
SQLite (the default), so each test run operates on the seeded catalog.
"""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_menu_returns_200_with_list() -> None:
    """GET /api/menu must return 200 and a JSON array."""
    response = client.get("/api/menu")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_menu_has_at_least_three_categories() -> None:
    """Seed data provides at least 3 categories with available items."""
    response = client.get("/api/menu")
    categories = response.json()
    assert len(categories) >= 3


def test_menu_has_at_least_ten_items_total() -> None:
    """Seed data provides 10+ available items across all categories."""
    response = client.get("/api/menu")
    total_items = sum(len(cat["items"]) for cat in response.json())
    assert total_items >= 10


def test_category_structure() -> None:
    """Each category object has the required fields with correct types."""
    response = client.get("/api/menu")
    for cat in response.json():
        assert isinstance(cat["id"], int)
        assert isinstance(cat["name"], str)
        assert isinstance(cat["display_order"], int)
        assert isinstance(cat["items"], list)


def test_item_structure() -> None:
    """Each item object has the required fields with correct types."""
    response = client.get("/api/menu")
    for cat in response.json():
        for item in cat["items"]:
            assert isinstance(item["id"], int)
            assert isinstance(item["name"], str)
            assert item["description"] is None or isinstance(item["description"], str)
            assert isinstance(item["price"], (int, float))
            assert item["image_url"] is None or isinstance(item["image_url"], str)
            assert isinstance(item["is_available"], bool)


def test_categories_ordered_by_display_order_ascending() -> None:
    """Categories must appear in ascending display_order."""
    response = client.get("/api/menu")
    orders = [cat["display_order"] for cat in response.json()]
    assert orders == sorted(orders)


def test_unavailable_items_excluded() -> None:
    """No item with is_available=false should appear in the response."""
    response = client.get("/api/menu")
    for cat in response.json():
        for item in cat["items"]:
            assert item["is_available"] is True


def test_categories_with_no_available_items_excluded() -> None:
    """The 'Seasonal' category (all unavailable) must not appear."""
    response = client.get("/api/menu")
    names = [cat["name"] for cat in response.json()]
    assert "Seasonal" not in names


def test_all_returned_categories_have_items() -> None:
    """No category in the response should have an empty items array."""
    response = client.get("/api/menu")
    for cat in response.json():
        assert len(cat["items"]) > 0


def test_health_still_passes() -> None:
    """The existing /health endpoint must remain functional."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_openapi_still_builds() -> None:
    """The OpenAPI document must still resolve after the changes."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert "/api/menu" in response.json()["paths"]
