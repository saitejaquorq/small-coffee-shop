"""Shared-password authentication and JWT utilities.

The architecture specifies a single shared password for staff and another for
admin. Successful authentication issues a JWT the frontend sends as a Bearer
token on protected routes.

Passwords and the signing secret are read from environment variables so the
scaffold runs with defaults but a deployment can override them.
"""

import os
from datetime import UTC, datetime, timedelta
from typing import Literal

import jwt

__all__ = [
    "STAFF_PASSWORD",
    "ADMIN_PASSWORD",
    "JWT_SECRET",
    "JWT_ALGORITHM",
    "create_token",
    "decode_token",
]

STAFF_PASSWORD = os.getenv("STAFF_PASSWORD", "roastdaily")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "roastery")
JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM = "HS256"

Role = Literal["staff", "admin"]


def create_token(role: Role) -> str:
    """Issue a JWT with the given role claim."""
    payload = {
        "role": role,
        "exp": datetime.now(UTC) + timedelta(hours=8),
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and verify a JWT, returning its payload."""
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])