"""Admin API endpoints for category and menu-item CRUD.

All routes require a valid admin JWT. Category handlers remain stubs; menu-item
handlers are fully implemented with database persistence and validation.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import auth
from app.database import get_db
from app.models import Category, MenuItem
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
    """Dependency that verifies an admin JWT from the Authorization header."""
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
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
DbDep = Annotated[Session, Depends(get_db)]


# ── Categories (stubs) ────────────────────────────────────────────────────


@router.get("/categories", response_model=list[CategoryWithItemCount])
async def list_categories(_: AdminDep) -> list[StubResponse]:
    """List all categories including those with no items.

    Stub: replace with a database query.
    """
    return []


@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(body: CategoryCreate, _: AdminDep) -> StubResponse:
    """Create a new category.

    Stub: replace with a database insert.
    """
    return StubResponse(endpoint="POST /api/admin/categories")


@router.put("/categories/{category_id}", response_model=CategoryOut)
async def update_category(category_id: int, body: CategoryUpdate, _: AdminDep) -> StubResponse:
    """Update an existing category name and display order.

    Stub: replace with a database update; return 404 when not found.
    """
    return StubResponse(endpoint=f"PUT /api/admin/categories/{category_id}")


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, _: AdminDep) -> None:
    """Delete a category. Returns 409 if items are still assigned.

    Stub: replace with a database delete; check for assigned items first.
    """
    return None


# ── Menu items ────────────────────────────────────────────────────────────


@router.get("/items", response_model=list[MenuItemAdminOut])
async def list_items(_: AdminDep, db: DbDep) -> list[MenuItem]:
    """List all menu items with their category."""
    return list(db.execute(select(MenuItem)).scalars().all())


@router.post("/items", response_model=MenuItemAdminOut, status_code=status.HTTP_201_CREATED)
async def create_item(body: MenuItemCreate, _: AdminDep, db: DbDep) -> MenuItem:
    """Create a new menu item.

    Validates that ``category_id`` references an existing category, returning
    422 when it does not.
    """
    category = db.get(Category, body.category_id)
    if category is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="category_id does not reference an existing category",
        )
    item = MenuItem(
        category_id=body.category_id,
        name=body.name,
        description=body.description,
        price=body.price,
        image_url=body.image_url,
        is_available=body.is_available,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/items/{item_id}", response_model=MenuItemAdminOut)
async def update_item(item_id: int, body: MenuItemUpdate, _: AdminDep, db: DbDep) -> MenuItem:
    """Update an existing menu item.

    Accepts partial updates — only fields present in the request body are
    modified. Returns 404 when the item does not exist and 422 when a provided
    ``category_id`` does not reference an existing category.
    """
    item = db.get(MenuItem, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    update_data = body.model_dump(exclude_unset=True)

    if "category_id" in update_data and update_data["category_id"] is not None:
        category = db.get(Category, update_data["category_id"])
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="category_id does not reference an existing category",
            )

    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int, _: AdminDep, db: DbDep) -> None:
    """Delete a menu item. Returns 404 when not found."""
    item = db.get(MenuItem, item_id)
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    db.delete(item)
    db.commit()
    return None