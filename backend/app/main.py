"""Application entrypoint.

Generated from the approved architecture: one router per component that owns
endpoints, one route per endpoint the API spec declares. Every generated route
is a stub that returns a typed placeholder, so the service starts, serves its
OpenAPI document and passes its tests before a single handler is implemented.
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models  # noqa: F401 -- imported so the tables register before create_all
from app.database import Base, engine

app = FastAPI(
    title="Small coffee shop website where",
    description="Build a small coffee shop website where customers browse the menu and place an\norder for pickup. There are no customer accounts: every order is a guest order.\n\nWho it's for:\n- Customers (guests): browse the menu, add items to a cart, adjust quantities,\n  and place the order without signing in. On placing the order they get a cart\n  order ID to take to the kiosk.\n- Cafe staff: see incoming orders with their items and order ID so they can\n  prepare them.\n- Admin/owner: manage the menu (add, edit, remove items and prices).\n\nCore behaviour it cannot ship without:\n- Show the menu with items, descriptions, and prices.\n- Add items to a cart, change quantities, and remove items.\n- Place the order as a guest and generate a unique cart order ID.\n- Save every order (items, quantities, order ID, time) to the cafe's own\n  database.\n- Let staff view placed orders by order ID.\n\nWhat it works with:\n- Standalone. The cafe's own database is the only store. No external systems.\n- Payment is out of scope of the website. The customer pays at the kiosk by\n  giving the cart order ID; the website never takes payment and holds no\n  payment data.\n\nScale and constraints:\n- One coffee shop, small menu, small order volume.\n- Web-based, mobile-friendly for customers ordering on a phone.\n- No hard launch deadline.",
    version="0.1.0",
)

# The SPA runs on a different origin than the API, so the browser refuses its calls
# unless that origin is allowed here. In development that is the Vite dev server; when
# deployed, the platform injects the frontend's real URL as ALLOWED_ORIGINS (comma
# separated). Point ALLOWED_ORIGINS at the real thing and nothing else has to change.
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The scaffold ships no migrations, so the tables are created from the models on
# startup. Replace this with Alembic before anything holds data worth keeping.
Base.metadata.create_all(bind=engine)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}
