"""JWT sign-in at the role seam: a bearer token carries the role; the X-Role header stays a dev convenience."""
from datetime import datetime, timedelta, timezone

import jwt
from fastapi.testclient import TestClient

from app.config import settings
from app.main import app


def _login(client, username, password):
    return client.post("/api/v1/auth/login", json={"username": username, "password": password})


def test_login_returns_a_token_carrying_the_configured_role(client):
    response = _login(client, "operator", "operator")
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["token_type"] == "bearer" and body["role"] == "OPERATOR" and body["name"] == "operator"
    claims = jwt.decode(body["access_token"], settings.JWT_SECRET, algorithms=["HS256"])
    assert claims["sub"] == "operator" and claims["role"] == "OPERATOR" and claims["exp"] > datetime.now(timezone.utc).timestamp()


def test_wrong_password_and_unknown_user_are_rejected_alike(client):
    assert _login(client, "operator", "nope").status_code == 401
    assert _login(client, "ghost", "ghost").status_code == 401
    assert _login(client, "operator", "nope").json()["detail"]["code"] == "INVALID_CREDENTIALS"


def test_bearer_token_grants_its_role_without_any_header(client):
    token = _login(client, "operator", "operator").json()["access_token"]
    anonymous = TestClient(app)
    me = anonymous.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}).json()
    assert me["role"] == "OPERATOR" and me["name"] == "operator"
    client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
    case_id = client.get("/api/v1/investigations").json()[0]["id"]
    escalated = anonymous.post(f"/api/v1/investigations/{case_id}/escalate", json={},
                               headers={"Authorization": f"Bearer {token}"})
    assert escalated.status_code == 200
    assert escalated.json()["audit_log"][-1]["actor"] == "operator"


def test_bad_or_expired_tokens_are_401(client):
    anonymous = TestClient(app)
    assert anonymous.get("/api/v1/auth/me", headers={"Authorization": "Bearer not-a-token"}).status_code == 401
    expired = jwt.encode({"sub": "operator", "role": "OPERATOR",
                          "exp": datetime.now(timezone.utc) - timedelta(minutes=1)}, settings.JWT_SECRET, algorithm="HS256")
    response = anonymous.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {expired}"})
    assert response.status_code == 401 and response.json()["detail"]["code"] == "INVALID_TOKEN"


def test_role_header_can_be_switched_off_for_production(client, monkeypatch):
    monkeypatch.setattr(settings, "AUTH_ALLOW_ROLE_HEADER", False)
    anonymous = TestClient(app)
    assert anonymous.get("/api/v1/auth/me", headers={"X-Role": "ADMIN"}).json()["role"] == "VIEWER"
    token = _login(client, "admin", "admin").json()["access_token"]
    assert anonymous.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"}).json()["role"] == "ADMIN"
