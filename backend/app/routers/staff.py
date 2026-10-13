"""Staff API endpoints: GET /api/staff/orders, PATCH /api/staff/orders/{id}/complete.

Both require a valid staff JWT. The handlers are stubs that return a typed
placeholder so the service starts and the OpenAPI document is complete before
a developer implements the real logic.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app import auth
from app.schemas import StaffOrderCompleteResponse, StaffOrderOut, StubResponse

router = APIRouter(prefix="/api/staff", tags=["staff"])


async def require_staff(authorization: str = Header(default="")) -> dict:
    """Dependency that verifies a staff JWT from the Authorization header.

    Stub: a developer will flesh this out with proper error handling. For now
    it parses the Bearer token so the route shape and dependency are in place.
    """
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
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


@router.get("/orders", response_model=list[StaffOrderOut])
async def list_staff_orders(_: StaffDep) -> list[StubResponse]:
    """List all incomplete orders sorted newest first.

    Stub: replace with a database query filtering on ``status = 'incomplete'``.
    """
    return []


@router.patch("/orders/{order_id}/complete", response_model=StaffOrderCompleteResponse)
async def complete_order(order_id: int, _: StaffDep) -> StubResponse:
    """Mark an order as complete, removing it from the active queue.

    Stub: replace with a database update; return 404 when not found.
    """
    return StubResponse(endpoint=f"PATCH /api/staff/orders/{order_id}/complete")