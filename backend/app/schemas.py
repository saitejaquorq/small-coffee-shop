"""Pydantic request and response models.

One pair per entity in the approved data model, plus the request/response
shapes each endpoint in the API spec declares. Every schema the OpenAPI
document exposes is defined here so a router file can import only what it
needs and the spec is resolved before a single handler is written.
"""

from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class StubResponse(BaseModel):
    """What a generated route returns until someone implements it.

    A stub that returns a typed body rather than raising keeps the service
    startable and its OpenAPI document complete, so the frontend can be built
    against the agreed shape while the handlers are still being written.
    """

    endpoint: str
    status: str = "not_implemented"
    detail: str = "Scaffolded from the approved API spec; no behaviour yet."


# ── Auth ──────────────────────────────────────────────────────────────────


class AuthRequest(BaseModel):
    password: str = Field(..., description="Shared password for the requested role.")


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"


# ── Menu / categories ─────────────────────────────────────────────────────


class MenuItemOut(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    image_url: str | None
    is_available: bool

    model_config = {"from_attributes": True}


class CategoryWithItems(BaseModel):
    id: int
    name: str
    display_order: int
    items: list[MenuItemOut]

    model_config = {"from_attributes": True}


class CategoryOut(BaseModel):
    id: int
    name: str
    display_order: int | None

    model_config = {"from_attributes": True}


class CategoryWithItemCount(BaseModel):
    id: int
    name: str
    display_order: int | None
    item_count: int

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    display_order: int | None = None


class CategoryUpdate(BaseModel):
    name: str
    display_order: int | None = None


# ── Menu items (admin) ────────────────────────────────────────────────────


class MenuItemAdminOut(BaseModel):
    id: int
    category_id: int
    name: str
    description: str | None
    price: float
    image_url: str | None
    is_available: bool

    model_config = {"from_attributes": True}


class MenuItemCreate(BaseModel):
    category_id: int
    name: str
    description: str | None = None
    price: float
    image_url: str | None = None
    is_available: bool = True


class MenuItemUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = None
    description: str | None = None
    price: float | None = None
    image_url: str | None = None
    is_available: bool | None = None


# ── Orders ────────────────────────────────────────────────────────────────


class OrderItemRequest(BaseModel):
    menu_item_id: int
    quantity: int
    notes: str | None = None


class OrderItemOut(BaseModel):
    name: str
    quantity: int
    unit_price: Decimal
    notes: str | None

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    customer_name: str
    pickup_time: Literal["asap", "15min", "30min"]
    items: list[OrderItemRequest]


class OrderResponse(BaseModel):
    cart_order_id: str
    customer_name: str
    pickup_time: str
    items: list[OrderItemOut]
    total: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Staff order listing ───────────────────────────────────────────────────


class StaffOrderItemOut(BaseModel):
    menu_item_name: str
    quantity: int
    unit_price: Decimal
    notes: str | None

    model_config = {"from_attributes": True}


class StaffOrderOut(BaseModel):
    id: int
    cart_order_id: str
    customer_name: str
    pickup_time: str
    status: str
    created_at: datetime
    items: list[StaffOrderItemOut]

    model_config = {"from_attributes": True}


class StaffOrderCompleteResponse(BaseModel):
    id: int
    cart_order_id: str
    status: Literal["complete"] = "complete"
