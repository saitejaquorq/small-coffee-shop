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
from app.routers import admin, auth, public_api, staff

_DESCRIPTION = (
    "Build a small coffee shop website where customers browse the menu and "
    "place an order for pickup. There are no customer accounts: every order "
    "is a guest order. Customers browse the menu, add items to a cart, adjust "
    "quantities, and place the order without signing in. On placing the order "
    "they get a cart order ID to take to the kiosk. Cafe staff see incoming "
    "orders with their items and order ID. Admin/owner manages the menu."
)

app = FastAPI(
    title="Small coffee shop website where",
    description=_DESCRIPTION,
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

# One router per architecture component that owns endpoints.
app.include_router(public_api.router)
app.include_router(auth.router)
app.include_router(staff.router)
app.include_router(admin.router)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe, and the only route here that is not a stub."""
    return {"status": "ok"}