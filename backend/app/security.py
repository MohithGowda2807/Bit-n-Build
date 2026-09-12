"""Role-based access and sign-in (spec sections 92-93).

A caller holds a role in one of two ways. A bearer token from `POST /auth/login`
carries the name and role of a configured account. Without a token, and only
while `AUTH_ALLOW_ROLE_HEADER` is on, the `X-Role` and `X-User` headers stand
in for it so demos and tests need no sign-in. Missing both means VIEWER.
"""
import hmac
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Dict, Optional

import jwt
from fastapi import Depends, Header, HTTPException, status

from app.config import settings

ROLES = ("VIEWER", "ANALYST", "OPERATOR", "ADMIN")

# What each level unlocks; the UI mirrors this table.
PERMISSIONS: Dict[str, str] = {
    "view_map": "VIEWER",
    "view_cases": "ANALYST",
    "ask_analyst": "ANALYST",
    "act_on_cases": "OPERATOR",
    "run_scenarios": "OPERATOR",
    "manage_system": "ADMIN",
}


@dataclass(frozen=True)
class Principal:
    role: str
    name: Optional[str] = None

    @property
    def actor(self) -> str:
        return self.name or self.role.lower()

    def at_least(self, role: str) -> bool:
        return ROLES.index(self.role) >= ROLES.index(role)

    def permissions(self) -> Dict[str, bool]:
        return {action: self.at_least(minimum) for action, minimum in PERMISSIONS.items()}


@dataclass(frozen=True)
class Account:
    name: str
    password: str
    role: str


def configured_accounts() -> Dict[str, Account]:
    accounts: Dict[str, Account] = {}
    for entry in settings.AUTH_USERS.split(";"):
        parts = entry.strip().split(":")
        if len(parts) == 3 and parts[2].upper() in ROLES:
            accounts[parts[0]] = Account(parts[0], parts[1], parts[2].upper())
    return accounts


def authenticate(username: str, password: str) -> Optional[Account]:
    account = configured_accounts().get(username)
    if account is None or not hmac.compare_digest(account.password, password):
        return None
    return account


def issue_token(account: Account) -> Dict[str, object]:
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_TTL_MINUTES)
    token = jwt.encode({"sub": account.name, "role": account.role, "exp": expires}, settings.JWT_SECRET, algorithm="HS256")
    return {"access_token": token, "token_type": "bearer", "role": account.role, "name": account.name,
            "expires_at": expires.isoformat()}


def principal_from_token(token: str) -> Principal:
    try:
        claims = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail={"code": "INVALID_TOKEN", "message": f"Bearer token rejected: {exc}"})
    role = str(claims.get("role", "")).upper()
    if role not in ROLES:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail={"code": "INVALID_TOKEN", "message": "Bearer token carries no known role."})
    return Principal(role=role, name=str(claims.get("sub")) or None)


def current_principal(
    authorization: Optional[str] = Header(None, alias="Authorization"),
    x_role: Optional[str] = Header(None, alias="X-Role"),
    x_user: Optional[str] = Header(None, alias="X-User"),
) -> Principal:
    if authorization and authorization.lower().startswith("bearer "):
        return principal_from_token(authorization[7:].strip())
    if not settings.AUTH_ALLOW_ROLE_HEADER:
        return Principal(role="VIEWER")
    role = (x_role or "VIEWER").strip().upper()
    if role not in ROLES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "UNKNOWN_ROLE", "message": f"Unknown role '{x_role}'.", "allowed": list(ROLES)},
        )
    name = x_user.strip() if x_user and x_user.strip() else None
    return Principal(role=role, name=name)


def require(minimum: str):
    """Dependency that admits the caller only at `minimum` role or higher."""

    def guard(principal: Principal = Depends(current_principal)) -> Principal:
        if not principal.at_least(minimum):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={"code": "FORBIDDEN", "message": f"This action requires the {minimum} role or higher.",
                        "required": minimum, "role": principal.role},
            )
        return principal

    return guard
