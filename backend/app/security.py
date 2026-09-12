"""Role-based access (spec sections 92-93).

The caller's identity arrives in two headers: `X-Role` (VIEWER, ANALYST,
OPERATOR or ADMIN; missing means VIEWER) and `X-User` (a display name for the
audit log). Authentication proper (JWT) is a later step; this fixes the seam
every guarded route uses, so swapping the header for a token touches one place.
"""
from dataclasses import dataclass
from typing import Dict, Optional

from fastapi import Depends, Header, HTTPException, status

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


def current_principal(
    x_role: Optional[str] = Header(None, alias="X-Role"),
    x_user: Optional[str] = Header(None, alias="X-User"),
) -> Principal:
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
