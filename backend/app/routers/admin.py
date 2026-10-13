"""Admin API endpoints for category and menu-item CRUD.

All routes require a valid admin JWT. The handlers are stubs that return a
typed placeholder so the service starts and the OpenAPI document is complete
before a developer implements the real logic.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status

from app import auth
from app.schemas import (
    CategoryCreate,
    CategoryOut,
    CategoryUpdate,
    CategoryWithItemCount,
    MenuItemAdminOut,
    MenuItemCreate,
    MenuItemUpdate,
    StubResponse,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


async def require_admin(authorization: str = Header(default="")) -> dict:
    """Dependency that verifies an admin JWT from the Authorization header.

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
    if payload.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Admin access required"
        )
    return payload


AdminDep = Annotated[dict, Depends(require_admin)]


# ── Categories ────────────────────────────────────────────────────────────


@router.get("/categories", response_model=list[CategoryWithItemCount])
async def list_categories(_: AdminDep) -> list[StubResponse]:
    """List all categories including those with no items.

    Stub: replace with a database query.
    """
    return []


@router.post(
    "/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED
)
async def create_category(body: CategoryCreate, _: AdminDep) -> StubResponse:
    """Create a new category.

    Stub: replace with a database insert.
    """
    return StubResponse(endpoint="POST /api/admin/categories")


@router.put("/categories/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: int, body: CategoryUpdate, _: AdminDep
) -> StubResponse:
    """Update an existing category name and display order.

    Stub: replace with a database update; return 404 when not found.
    """
    return StubResponse(endpoint=f"PUT /api/admin/categories/{category_id}")


@router.delete(
    "/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_category(category_id: int, _: AdminDep) -> None:
    """Delete a category. Returns 409 if items are still assigned.

    Stub: replace with a database delete; check for assigned items first.
    """
    return None


# ── Menu items ────────────────────────────────────────────────────────────


@router.get("/items", response_model=list[MenuItemAdminOut])
async def list_items(_: AdminDep) -> list[StubResponse]:
    """List all menu items with their category.

    Stub: replace with a database query.
    """
    return []


@router.post("/items", response_model=MenuItemAdminOut, status_code=status.HTTP_201_CREATED)
async def create_item(body: MenuItemCreate, _: AdminDep) -> StubResponse:
    """Create a new menu item.

    Stub: replace with a database insert.
    """
    return StubResponse(endpoint="POST /api/admin/items")


@router.put("/items/{item_id}", response_model=MenuItemAdminOut)
async def update_item(
    item_id: int, body: MenuItemUpdate, _: AdminDep
) -> StubResponse:
    """Update an existing menu item.

    Stub: replace with a database update; return 404 when not found.
    """
    return StubResponse(endpoint=f"PUT /api/admin/items/{item_id}")


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int, _: AdminDep) -> None:
    """Delete a menu item.

    Stub: replace with a database delete; return 404 when not found.
    """
    return None