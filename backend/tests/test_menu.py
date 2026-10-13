"""Tests for the public GET /api/menu endpoint.

These tests verify the endpoint returns correctly grouped, filtered menu data
following the contract: categories ordered by display_order, unavailable items
excluded, and categories with no available items excluded.

Tests that need specific data (unavailable items, empty categories) insert
their own rows and clean up afterwards so they are independent of seed data
and of each other.
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.main import app
from app.models import Category, MenuItem

client = TestClient(app)


# ── Helpers ───────────────────────────────────────────────────────────────


def _get_menu() -> list[dict]:
    """Call GET /api/menu and return the parsed JSON list."""
    response = client.get("/api/menu")
    assert response.status_code == 200
    return response.json()


# ── AC1: GET /api/menu returns 200 with an array of category objects ──────


def test_menu_returns_200_with_array() -> None:
    """GET /api/menu must return HTTP 200 and a JSON array."""
    response = client.get("/api/menu")

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    # Every element should be a dict (category object)
    for entry in data:
        assert isinstance(entry, dict)


# ── AC2: each category has id, name, display_order, and items ─────────────


def test_category_has_required_fields() -> None:
    """Every category object must have id, name, display_order, and items."""
    categories = _get_menu()

    assert len(categories) > 0, "Expected at least one category from seed data"
    for cat in categories:
        assert "id" in cat
        assert "name" in cat
        assert "display_order" in cat
        assert "items" in cat
        assert isinstance(cat["id"], int)
        assert isinstance(cat["name"], str)
        assert isinstance(cat["display_order"], int)
        assert isinstance(cat["items"], list)


# ── AC3: each item has id, name, description, price, image_url, is_available


def test_item_has_required_fields() -> None:
    """Every item object must have the six required fields with correct types."""
    categories = _get_menu()

    assert len(categories) > 0
    for cat in categories:
        assert len(cat["items"]) > 0, f"Category {cat['name']} has no items"
        for item in cat["items"]:
            assert "id" in item
            assert "name" in item
            assert "description" in item
            assert "price" in item
            assert "image_url" in item
            assert "is_available" in item
            assert isinstance(item["id"], int)
            assert isinstance(item["name"], str)
            assert item["description"] is None or isinstance(item["description"], str)
            assert isinstance(item["price"], (int, float))
            assert item["image_url"] is None or isinstance(item["image_url"], str)
            assert isinstance(item["is_available"], bool)


# ── AC4: categories with no available items are excluded ──────────────────


def test_category_with_no_available_items_excluded() -> None:
    """A category whose items are all unavailable must not appear in the response."""
    session: Session = SessionLocal()
    created_category = None
    try:
        # Insert a category with only unavailable items
        seasonal = Category(name="TestSeasonal", display_order=99)
        session.add(seasonal)
        session.flush()

        created_category = seasonal
        unavailable_item = MenuItem(
            category_id=seasonal.id,
            name="TestUnavailableItem",
            description="Should not appear",
            price=9.99,
            image_url=None,
            is_available=False,
        )
        session.add(unavailable_item)
        session.commit()

        categories = _get_menu()
        names = [cat["name"] for cat in categories]
        assert "TestSeasonal" not in names
    finally:
        if created_category is not None:
            # Clean up: deleting the category cascades to its items
            cat = session.get(Category, created_category.id)
            if cat is not None:
                session.delete(cat)
            session.commit()
        session.close()


# ── AC5: items with is_available=false are excluded ───────────────────────


def test_unavailable_items_excluded() -> None:
    """No item in the response should have is_available=False."""
    categories = _get_menu()
    for cat in categories:
        for item in cat["items"]:
            assert item["is_available"] is True


def test_unavailable_item_hidden_from_category() -> None:
    """An unavailable item must not appear in its category's items array."""
    session: Session = SessionLocal()
    created_category = None
    try:
        # Insert a category with one available and one unavailable item
        test_cat = Category(name="TestMixed", display_order=50)
        session.add(test_cat)
        session.flush()
        created_category = test_cat

        available = MenuItem(
            category_id=test_cat.id,
            name="TestAvailable",
            description="Available item",
            price=1.00,
            image_url=None,
            is_available=True,
        )
        unavailable = MenuItem(
            category_id=test_cat.id,
            name="TestUnavailable",
            description="Unavailable item",
            price=2.00,
            image_url=None,
            is_available=False,
        )
        session.add_all([available, unavailable])
        session.commit()

        categories = _get_menu()
        test_cat_resp = next((c for c in categories if c["name"] == "TestMixed"), None)
        assert test_cat_resp is not None, "Category with available items should appear"
        item_names = [item["name"] for item in test_cat_resp["items"]]
        assert "TestAvailable" in item_names
        assert "TestUnavailable" not in item_names
    finally:
        if created_category is not None:
            cat = session.get(Category, created_category.id)
            if cat is not None:
                session.delete(cat)
            session.commit()
        session.close()


# ── AC6: categories are ordered by display_order ──────────────────────────


def test_categories_ordered_by_display_order() -> None:
    """Categories must appear in ascending display_order."""
    categories = _get_menu()
    orders = [cat["display_order"] for cat in categories]
    assert orders == sorted(orders), f"Categories not ordered by display_order: {orders}"


# ── AC7: endpoint works on a fresh database with seed data ────────────────


def test_menu_works_with_seed_data() -> None:
    """The endpoint must return populated data from the seed catalog."""
    categories = _get_menu()

    # Seed data has 3 categories: Coffee, Tea, Pastries
    assert len(categories) >= 3
    names = [cat["name"] for cat in categories]
    assert "Coffee" in names
    assert "Tea" in names
    assert "Pastries" in names

    # Each seed category should have at least one item
    for cat in categories:
        assert len(cat["items"]) > 0

    # Total items across all categories should be at least 10 (seed provides 11)
    total_items = sum(len(cat["items"]) for cat in categories)
    assert total_items >= 10


# ── Edge case: all returned categories have non-empty items ───────────────


def test_no_empty_categories_in_response() -> None:
    """No category in the response should have an empty items array."""
    categories = _get_menu()
    for cat in categories:
        assert len(cat["items"]) > 0, f"Category {cat['name']} has empty items"
