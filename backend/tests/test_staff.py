"""Integration tests for staff authentication and staff order endpoints.

Covers:
- POST /api/auth/staff with correct password returns 200 and a token
- POST /api/auth/staff with incorrect password returns 401
- Admin token does not work for staff endpoints (cross-role boundary)
- Staff token does not work for admin endpoints (cross-role boundary)
- GET /api/staff/orders returns orders with staff token
- PATCH /api/staff/orders/{id}/complete marks order complete
- All staff endpoints return 401 without a valid token
"""

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app import auth
from app.database import SessionLocal
from app.main import app
from app.models import Order, OrderItem

client = TestClient(app)

ADMIN_PASSWORD = auth.ADMIN_PASSWORD
STAFF_PASSWORD = auth.STAFF_PASSWORD


# ── Helpers ───────────────────────────────────────────────────────────────


def _staff_token() -> str:
    """Obtain a valid staff token via the auth endpoint."""
    response = client.post("/api/auth/staff", json={"password": STAFF_PASSWORD})
    assert response.status_code == 200
    return response.json()["access_token"]


def _staff_headers() -> dict[str, str]:
    """Return Authorization headers with a valid staff token."""
    return {"Authorization": f"Bearer {_staff_token()}"}


def _admin_token() -> str:
    """Obtain a valid admin token via the auth endpoint."""
    response = client.post("/api/auth/admin", json={"password": ADMIN_PASSWORD})
    assert response.status_code == 200
    return response.json()["access_token"]


def _admin_headers() -> dict[str, str]:
    """Return Authorization headers with a valid admin token."""
    return {"Authorization": f"Bearer {_admin_token()}"}


def _create_order(session: Session, *, status: str = "incomplete") -> Order:
    """Insert an order directly into the DB and return it."""
    import uuid

    order = Order(
        cart_order_id=str(uuid.uuid4())[:8].upper(),
        customer_name="Test Customer",
        pickup_time="asap",
        status=status,
    )
    session.add(order)
    session.flush()

    item = OrderItem(
        order_id=order.id,
        menu_item_name="Espresso",
        quantity=2,
        unit_price=3.00,
        notes=None,
    )
    session.add(item)
    session.commit()
    session.refresh(order)
    return order


def _cleanup_order(session: Session, order_id: int) -> None:
    """Delete an order if it still exists."""
    order = session.get(Order, order_id)
    if order is not None:
        session.delete(order)
    session.commit()


# ── POST /api/auth/staff with correct password returns 200 and a token ────


def test_staff_login_correct_password_returns_200() -> None:
    """Correct staff password must return 200 with a token."""
    response = client.post("/api/auth/staff", json={"password": STAFF_PASSWORD})

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert isinstance(data["access_token"], str)
    assert len(data["access_token"]) > 0
    assert data["token_type"] == "bearer"


# ── POST /api/auth/staff with incorrect password returns 401 ──────────────


def test_staff_login_incorrect_password_returns_401() -> None:
    """Incorrect staff password must return 401 with an error detail."""
    response = client.post("/api/auth/staff", json={"password": "wrong-password"})

    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert isinstance(data["detail"], str)
    assert len(data["detail"]) > 0


# ── Admin token does not work for staff endpoints ─────────────────────────


def test_staff_orders_with_admin_token_returns_401() -> None:
    """An admin token must not work on staff endpoints."""
    admin_token = _admin_token()
    response = client.get(
        "/api/staff/orders",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 401


def test_staff_complete_order_with_admin_token_returns_401() -> None:
    """An admin token must not work on staff complete-order endpoint."""
    admin_token = _admin_token()
    response = client.patch(
        "/api/staff/orders/1/complete",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 401


# ── Staff token does not work for admin endpoints ─────────────────────────


def test_admin_items_with_staff_token_returns_401() -> None:
    """A staff token must not work on admin item endpoints."""
    staff_token = _staff_token()
    response = client.get(
        "/api/admin/items",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 401


def test_admin_categories_with_staff_token_returns_401() -> None:
    """A staff token must not work on admin category endpoints."""
    staff_token = _staff_token()
    response = client.get(
        "/api/admin/categories",
        headers={"Authorization": f"Bearer {staff_token}"},
    )
    assert response.status_code == 401


# ── All staff endpoints return 401 without a valid token ──────────────────


def test_staff_orders_without_token_returns_401() -> None:
    """GET /api/staff/orders without a token must return 401."""
    response = client.get("/api/staff/orders")
    assert response.status_code == 401


def test_staff_complete_order_without_token_returns_401() -> None:
    """PATCH /api/staff/orders/{id}/complete without a token must return 401."""
    response = client.patch("/api/staff/orders/1/complete")
    assert response.status_code == 401


def test_staff_orders_with_invalid_token_returns_401() -> None:
    """An invalid/garbage token must return 401 on staff endpoints."""
    response = client.get(
        "/api/staff/orders",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401


# ── GET /api/staff/orders returns orders with staff token ─────────────────


def test_staff_orders_returns_list_with_valid_token() -> None:
    """GET /api/staff/orders with a valid staff token returns 200 and a list."""
    response = client.get("/api/staff/orders", headers=_staff_headers())

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_staff_orders_includes_created_order() -> None:
    """An order created in the DB must appear in GET /api/staff/orders."""
    session: Session = SessionLocal()
    created_order = None
    try:
        created_order = _create_order(session)

        response = client.get("/api/staff/orders", headers=_staff_headers())
        assert response.status_code == 200
        orders = response.json()
        assert isinstance(orders, list)
        order_ids = [o["id"] for o in orders]
        assert created_order.id in order_ids

        # Verify the order has the expected fields
        matched = next(o for o in orders if o["id"] == created_order.id)
        assert matched["cart_order_id"] == created_order.cart_order_id
        assert matched["customer_name"] == "Test Customer"
        assert matched["pickup_time"] == "asap"
        assert matched["status"] == "incomplete"
        assert isinstance(matched["items"], list)
        assert len(matched["items"]) >= 1
        for item in matched["items"]:
            assert "menu_item_name" in item
            assert "quantity" in item
            assert "unit_price" in item
            assert "notes" in item
    finally:
        if created_order is not None:
            _cleanup_order(session, created_order.id)
        session.close()


# ── PATCH /api/staff/orders/{id}/complete marks order complete ────────────


def test_complete_order_marks_status_complete() -> None:
    """PATCH /api/staff/orders/{id}/complete must set status to 'complete'."""
    session: Session = SessionLocal()
    created_order = None
    try:
        created_order = _create_order(session)

        response = client.patch(
            f"/api/staff/orders/{created_order.id}/complete",
            headers=_staff_headers(),
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == created_order.id
        assert data["status"] == "complete"
        assert "cart_order_id" in data
    finally:
        if created_order is not None:
            _cleanup_order(session, created_order.id)
        session.close()


def test_complete_order_not_found_returns_404() -> None:
    """PATCH on a non-existent order must return 404."""
    response = client.patch(
        "/api/staff/orders/999999/complete",
        headers=_staff_headers(),
    )
    assert response.status_code == 404


# ── All protected admin endpoints return 401 without a valid token ────────


def test_admin_items_endpoints_without_token_return_401() -> None:
    """Every admin item endpoint must return 401 without a token."""
    assert client.get("/api/admin/items").status_code == 401
    assert (
        client.post(
            "/api/admin/items",
            json={"name": "X", "price": 1.0, "category_id": 1},
        ).status_code
        == 401
    )
    assert client.put("/api/admin/items/1", json={"name": "X"}).status_code == 401
    assert client.delete("/api/admin/items/1").status_code == 401
