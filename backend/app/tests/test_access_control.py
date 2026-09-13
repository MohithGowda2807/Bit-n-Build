"""Role-based access (spec sections 92-93): VIEWER < ANALYST < OPERATOR < ADMIN via the X-Role header."""
import pytest
from fastapi.testclient import TestClient

from app.main import app


def _as(role, name=None):
    headers = {"X-Role": role}
    if name:
        headers["X-User"] = name
    return headers


def _open_case_id(client):
    client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
    return client.get("/api/v1/investigations", params={"status": "OPEN"}).json()[0]["id"]


def test_no_role_header_means_viewer_who_can_see_the_map_but_not_cases(client):
    anonymous = TestClient(app)
    assert anonymous.get("/api/v1/vessels").status_code == 200
    assert anonymous.get("/api/v1/surveillance/risk").status_code == 200
    denied = anonymous.get("/api/v1/investigations")
    assert denied.status_code == 403
    detail = denied.json()["detail"]
    assert detail["code"] == "FORBIDDEN" and detail["required"] == "ANALYST" and detail["role"] == "VIEWER"


def test_unknown_role_is_rejected(client):
    response = client.get("/api/v1/auth/me", headers=_as("CAPTAIN"))
    assert response.status_code == 400
    assert response.json()["detail"]["code"] == "UNKNOWN_ROLE"


def test_analyst_reads_cases_but_cannot_act_on_them(client):
    case_id = _open_case_id(client)
    assert client.get(f"/api/v1/investigations/{case_id}", headers=_as("ANALYST")).status_code == 200
    denied = client.post(f"/api/v1/investigations/{case_id}/escalate", json={}, headers=_as("ANALYST"))
    assert denied.status_code == 403 and denied.json()["detail"]["required"] == "OPERATOR"
    assert client.post("/api/v1/simulation/run", json={"scenario": "AIS_GAP"}, headers=_as("ANALYST")).status_code == 403


def test_operator_acts_on_cases_and_the_audit_log_names_them(client):
    case_id = _open_case_id(client)
    response = client.post(f"/api/v1/investigations/{case_id}/escalate", json={"note": "coast guard notified"},
                           headers=_as("OPERATOR", "priya.n"))
    assert response.status_code == 200
    last = response.json()["audit_log"][-1]
    assert last["action"] == "CASE_ESCALATED" and last["actor"] == "priya.n" and last["role"] == "OPERATOR"


def test_only_admin_resets_the_simulation(client):
    assert client.post("/api/v1/simulation/reset", headers=_as("OPERATOR")).status_code == 403
    assert client.post("/api/v1/simulation/reset", headers=_as("ADMIN")).status_code == 200


def test_whoami_reports_role_and_permissions(client):
    me = client.get("/api/v1/auth/me", headers=_as("ANALYST", "sam")).json()
    assert me["name"] == "sam" and me["role"] == "ANALYST"
    assert me["permissions"]["view_cases"] is True
    assert me["permissions"]["act_on_cases"] is False
    assert me["permissions"]["run_scenarios"] is False
    assert me["permissions"]["manage_system"] is False
    roles = client.get("/api/v1/auth/roles").json()
    assert roles == ["VIEWER", "ANALYST", "OPERATOR", "ADMIN"]


def test_phase2_hazards_and_cycle_need_operator_and_mode_needs_admin(client):
    analyst, operator, admin = _as("ANALYST"), _as("OPERATOR"), _as("ADMIN")
    storm = {"scenario_preset": "bay_of_bengal_cyclone"}
    assert client.post("/api/v1/simulation/scenarios/inject-storm", json=storm, headers=analyst).status_code == 403
    assert client.post("/api/v1/simulation/scenarios/inject-storm", json=storm, headers=operator).status_code == 200
    assert client.post("/api/v1/simulation/scenarios/reset-environment", headers=analyst).status_code == 403
    assert client.post("/api/v1/simulation/scenarios/reset-environment", headers=operator).status_code == 200
    assert client.post("/api/v1/simulation/cycle", headers=analyst).status_code == 403
    assert client.post("/api/v1/simulation/mode", json={"mode": "advisory"}, headers=operator).status_code == 403
    assert client.post("/api/v1/simulation/mode", json={"mode": "autonomous"}, headers=admin).status_code == 200
    assert client.get("/api/v1/simulation/mode").json()["mode"] == "autonomous"
    assert client.delete("/api/v1/storms", headers=analyst).status_code == 403
    assert client.delete("/api/v1/storms", headers=operator).status_code == 200


def test_phase4_fleet_dispatch_needs_operator_and_moves_the_unit(client):
    analyst, operator = _as("ANALYST"), _as("OPERATOR")
    unit = client.get("/api/v1/fleet/units").json()[0]
    mission = {"mission_name": "Access test sortie", "mission_type": "debris_cleanup", "status": "pending",
               "assigned_unit_id": unit["id"], "priority": "high", "approval_status": "pending_approval",
               "waypoints_json": "[]", "target_debris_ids": "[]", "target_kg": 500}
    assert client.post("/api/v1/missions", json=mission, headers=analyst).status_code == 403
    created = client.post("/api/v1/missions", json=mission, headers=operator)
    assert created.status_code == 201
    mission_id = created.json()["id"]
    assert client.post(f"/api/v1/missions/{mission_id}/approve?decision=approve", headers=analyst).status_code == 403
    approved = client.post(f"/api/v1/missions/{mission_id}/approve?decision=approve", headers=operator).json()
    assert approved["status"] == "active" and approved["approval_status"] == "approved"
    moved = client.get(f"/api/v1/fleet/units/{unit['id']}").json()
    assert moved["status"] == "transit" and moved["assigned_mission_id"] == mission_id
    assert client.post(f"/api/v1/fleet/units/{unit['id']}/command", json={"command": "hold"}, headers=analyst).status_code == 403


# Phase 1 write routes: (method, path, minimum role). A viewer is refused before any body is read.
PHASE1_WRITES = [
    ("POST", "/api/v1/agents/orchestrate", "ANALYST"),
    ("POST", "/api/v1/agents/decision", "OPERATOR"),
    ("POST", "/api/v1/agents/approve", "OPERATOR"),
    ("POST", "/api/v1/ais/simulate", "OPERATOR"),
    ("POST", "/api/v1/alerts", "ANALYST"),
    ("PATCH", "/api/v1/alerts/1/ack", "ANALYST"),
    ("POST", "/api/v1/incidents", "ANALYST"),
    ("POST", "/api/v1/debris", "ANALYST"),
    ("PATCH", "/api/v1/debris/1", "OPERATOR"),
    ("POST", "/api/v1/fleet/units", "ADMIN"),
    ("POST", "/api/v1/fleet/units/1/step", "OPERATOR"),
    ("POST", "/api/v1/missions/plan", "OPERATOR"),
    ("POST", "/api/v1/routes/optimize", "ANALYST"),
    ("POST", "/api/v1/simulation/load-scenario/x", "OPERATOR"),
    ("POST", "/api/v1/tracks", "ANALYST"),
    ("POST", "/api/v1/vessels", "OPERATOR"),
    ("PATCH", "/api/v1/vessels/1", "OPERATOR"),
    ("POST", "/api/v1/voyages", "OPERATOR"),
    ("PATCH", "/api/v1/voyages/1", "OPERATOR"),
]


@pytest.mark.parametrize("method,path,minimum", PHASE1_WRITES)
def test_phase1_write_routes_refuse_a_viewer(client, method, path, minimum):
    response = client.request(method, path, json={}, headers=_as("VIEWER"))
    assert response.status_code == 403, (path, response.status_code, response.text[:120])
    assert response.json()["detail"]["required"] == minimum


def test_route_preview_is_open_to_analysts_but_recording_a_version_needs_an_operator(client):
    body = {"vessel_id": 1, "origin": {"latitude": 18.94, "longitude": 72.84},
            "destination": {"latitude": 1.29, "longitude": 103.85}, "mode": "fuel_efficient"}
    preview = client.post("/api/v1/routes/optimize", json={**body, "record_version": False}, headers=_as("ANALYST"))
    assert preview.status_code == 200
    recorded = client.post("/api/v1/routes/optimize", json={**body, "record_version": True}, headers=_as("ANALYST"))
    assert recorded.status_code == 403
    assert recorded.json()["detail"]["required"] == "OPERATOR"
