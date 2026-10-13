"""Public API endpoints: GET /api/menu, POST /api/orders, GET /api/orders/{id}.

These are the customer-facing routes — no authentication required.
``GET /api/menu`` is fully implemented; the order routes remain stubs.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Category
from app.schemas import (
    CategoryWithItems,
    OrderCreate,
    OrderResponse,
    StubResponse,
)

router = APIRouter(tags=["public"])

DbDep = Annotated[Session, Depends(get_db)]


@router.get("/api/menu", response_model=list[CategoryWithItems])
async def get_menu(db: DbDep) -> list[CategoryWithItems]:
    """Retrieve all categories that have at least one available menu item.

    Items with ``is_available=False`` are excluded from each category's
    ``items`` array, and categories that end up with no available items are
    excluded entirely. Categories are ordered by ``display_order`` ascending.
    """
    categories = (
        db.execute(select(Category).order_by(Category.display_order.asc())).scalars().all()
    )

    result: list[CategoryWithItems] = []
    for category in categories:
        available_items = [item for item in category.items if item.is_available]
        if not available_items:
            continue
        result.append(
            CategoryWithItems(
                id=category.id,
                name=category.name,
                display_order=category.display_order,
                items=available_items,
            )
        )
    return result


@router.post("/api/orders", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
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