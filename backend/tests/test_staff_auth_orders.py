"""Integration tests for staff authentication and staff order endpoints.

Covers:
- POST /api/auth/staff with correct/incorrect password
- GET /api/staff/orders returns orders with staff token
- PATCH /api/staff/orders/{id}/complete marks order complete
- Admin token does not work for staff endpoints (and vice versa is covered
  in test_admin_auth_categories.py and test_admin_items.py)
- All staff endpoints return 401 without a valid token
"""

from datetime import datetime

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


def _cart_order_id() -> str:
    """Generate a unique cart order ID that fits the String(20) column."""
    return f"T{datetime.now().strftime('%y%m%d%H%M%S%f')}"


def _create_order(session: Session, status: str = "incomplete") -> Order:
    """Insert an order directly into the database for testing."""
    order = Order(
        cart_order_id=_cart_order_id(),
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
    """Delete an order and its items if it still exists."""
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
    response = client.get("/api/staff/orders", headers=_admin_headers())
    assert response.status_code == 401


def test_staff_complete_order_with_admin_token_returns_401() -> None:
    """An admin token must not work on the staff complete-order endpoint."""
    response = client.patch(
        "/api/staff/orders/1/complete",
        headers=_admin_headers(),
    )
    assert response.status_code == 401


# ── Staff endpoints return 401 without a valid token ──────────────────────


def test_staff_orders_without_token_returns_401() -> None:
    """GET /api/staff/orders without a token must return 401."""
    response = client.get("/api/staff/orders")
    assert response.status_code == 401


def test_staff_complete_order_without_token_returns_401() -> None:
    """PATCH /api/staff/orders/{id}/complete without a token must return 401."""
    response = client.patch("/api/staff/orders/1/complete")
    assert response.status_code == 401


def test_staff_orders_with_invalid_token_returns_401() -> None:
    """An invalid/garbage token must return 401."""
    response = client.get(
        "/api/staff/orders",
        headers={"Authorization": "Bearer not-a-real-token"},
    )
    assert response.status_code == 401


# ── GET /api/staff/orders returns orders with staff token ─────────────────


def test_staff_orders_returns_list_with_staff_token() -> None:
    """GET /api/staff/orders with a valid staff token returns 200 and a list."""
    response = client.get("/api/staff/orders", headers=_staff_headers())

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


def test_staff_orders_includes_incomplete_order() -> None:
    """An incomplete order created in the database must appear in the list."""
    session: Session = SessionLocal()
    created_order = None
    try:
        created_order = _create_order(session, status="incomplete")

        response = client.get("/api/staff/orders", headers=_staff_headers())
        assert response.status_code == 200
        orders = response.json()
        assert isinstance(orders, list)
        order_ids = [o["id"] for o in orders]
        assert created_order.id in order_ids

        # Verify the order has the expected fields
        matching = next(o for o in orders if o["id"] == created_order.id)
        assert matching["cart_order_id"] == created_order.cart_order_id
        assert matching["customer_name"] == "Test Customer"
        assert matching["status"] == "incomplete"
        assert isinstance(matching["items"], list)
        assert len(matching["items"]) == 1
        assert matching["items"][0]["menu_item_name"] == "Espresso"
        assert matching["items"][0]["quantity"] == 2
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
        created_order = _create_order(session, status="incomplete")

        response = client.patch(
            f"/api/staff/orders/{created_order.id}/complete",
            headers=_staff_headers(),
        )
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == created_order.id
        assert data["status"] == "complete"

        # Verify the status was persisted to the database
        session.expire_all()
        order = session.get(Order, created_order.id)
        assert order.status == "complete"
    finally:
        if created_order is not None:
            _cleanup_order(session, created_order.id)
        session.close()