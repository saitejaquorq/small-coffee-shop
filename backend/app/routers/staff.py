"""Staff API endpoints: GET /api/staff/orders, PATCH /api/staff/orders/{id}/complete.

Both require a valid staff JWT. Staff tokens are issued by ``POST /api/auth/staff``
and carry a ``role = 'staff'`` claim; admin tokens are rejected here just as
staff tokens are rejected on admin routes.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import auth
from app.database import get_db
from app.models import Order
from app.schemas import StaffOrderCompleteResponse, StaffOrderOut

router = APIRouter(prefix="/api/staff", tags=["staff"])


async def require_staff(authorization: str = Header(default="")) -> dict:
    """Dependency that verifies a staff JWT from the Authorization header.

    Only tokens with ``role = 'staff'`` are accepted — admin tokens are
    rejected so the two roles remain isolated.
    """
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = auth.decode_token(token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        ) from exc
    if payload.get("role") != "staff":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Staff access required"
        )
    return payload


StaffDep = Annotated[dict, Depends(require_staff)]
DbDep = Annotated[Session, Depends(get_db)]


@router.get("/orders", response_model=list[StaffOrderOut])
async def list_staff_orders(_: StaffDep, db: DbDep) -> list[Order]:
    """List all orders sorted newest first.

    Every order is returned so staff can see the full queue. Each order
    includes its items with ``menu_item_name``, ``quantity``,
    ``unit_price``, and ``notes``.
    """
    orders = (
        db.execute(select(Order).order_by(Order.created_at.desc())).scalars().all()
    )
    return list(orders)


@router.patch("/orders/{order_id}/complete", response_model=StaffOrderCompleteResponse)
async def complete_order(order_id: int, _: StaffDep, db: DbDep) -> StaffOrderCompleteResponse:
    """Mark an order as complete, removing it from the active queue.

    Returns 404 when the order does not exist.
    """
    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    order.status = "complete"
    db.commit()
    db.refresh(order)
    return StaffOrderCompleteResponse(id=order.id, cart_order_id=order.cart_order_id)