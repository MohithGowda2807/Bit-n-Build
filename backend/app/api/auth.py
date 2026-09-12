from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.config import settings
from app.security import ROLES, Principal, authenticate, current_principal, issue_token


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    password: str = Field(..., min_length=1, max_length=200)

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.get("/roles", response_model=List[str])
def list_roles():
    return list(ROLES)


@router.post("/login")
def login(payload: LoginRequest):
    """Exchange a configured account's credentials for a bearer token carrying its role."""
    account = authenticate(payload.username, payload.password)
    if account is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail={"code": "INVALID_CREDENTIALS", "message": "Unknown user or wrong password."})
    return issue_token(account)


@router.get("/session-policy")
def session_policy():
    """Whether the dev role header is honoured; the UI hides the role picker when it is not."""
    return {"role_header_allowed": settings.AUTH_ALLOW_ROLE_HEADER, "token_ttl_minutes": settings.JWT_TTL_MINUTES}


@router.get("/me")
def whoami(principal: Principal = Depends(current_principal)):
    """The caller as the API sees them: role, audit name and what that role may do."""
    return {"name": principal.actor, "role": principal.role, "permissions": principal.permissions()}
