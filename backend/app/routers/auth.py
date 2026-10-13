"""Authentication endpoints: POST /api/auth/staff and POST /api/auth/admin.

Both accept a shared password and return a JWT. Successful authentication
issues a Bearer token the frontend sends on protected routes.
"""

from fastapi import APIRouter, HTTPException, status

from app import auth
from app.schemas import AuthRequest, TokenResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/staff", response_model=TokenResponse)
async def staff_login(body: AuthRequest) -> TokenResponse:
    """Authenticate staff with a shared password and receive a JWT."""
    if body.password == auth.STAFF_PASSWORD:
        return TokenResponse(access_token=auth.create_token("staff"))
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid password",
    )


@router.post("/admin", response_model=TokenResponse)
async def admin_login(body: AuthRequest) -> TokenResponse:
    """Authenticate admin with a shared password and receive a JWT.

    The staff password does not grant admin access — only the admin password
    is accepted here.
    """
    if body.password == auth.ADMIN_PASSWORD:
        return TokenResponse(access_token=auth.create_token("admin"))
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid password",
    )