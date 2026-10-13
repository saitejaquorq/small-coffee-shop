"""Public API endpoints: GET /api/menu, POST /api/orders, GET /api/orders/{id}.

These are the customer-facing routes — no authentication required. Each
handler is a stub that returns a typed placeholder so the service starts and
the OpenAPI document is complete before a developer implements the real logic.
"""

from fastapi import APIRouter, status

from app.schemas import (
    CategoryWithItems,
    OrderCreate,
    OrderResponse,
    StubResponse,
)

router = APIRouter(tags=["public"])


@router.get("/api/menu", response_model=list[CategoryWithItems])
async def get_menu() -> list[StubResponse]:
    """Retrieve all categories that have at least one available menu item.

    Stub: replace with a database query filtering on ``is_available``.
    """
    return []


@router.post(
    "/api/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED
)
async def place_order(body: OrderCreate) -> StubResponse:
    """Place a guest order with cart items, customer name, and pickup time.

    Stub: replace with order creation, cart-order-ID generation, and persistence.
    """
    return StubResponse(endpoint="POST /api/orders")


@router.get("/api/orders/{cart_order_id}", response_model=OrderResponse)
async def get_order(cart_order_id: str) -> StubResponse:
    """Retrieve an order by its cart order ID for the confirmation page.

    Stub: replace with a database lookup; return 404 when not found.
    """
    return StubResponse(endpoint="GET /api/orders/{cart_order_id}")