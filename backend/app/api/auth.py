from typing import List
from fastapi import APIRouter, Depends

from app.security import ROLES, Principal, current_principal

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.get("/roles", response_model=List[str])
def list_roles():
    return list(ROLES)


@router.get("/me")
def whoami(principal: Principal = Depends(current_principal)):
    """The caller as the API sees them: role, audit name and what that role may do."""
    return {"name": principal.actor, "role": principal.role, "permissions": principal.permissions()}
