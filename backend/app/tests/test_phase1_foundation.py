import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import Vessel, Track, Debris, Alert, Mission, Incident, MarineZone

client = TestClient(app)


def test_database_connected_and_seeded():
    """Verify all 6 database tables exist and are populated with deterministic seed data."""
    db = SessionLocal()
    try:
        assert db.query(Vessel).count() >= 10
        assert db.query(Track).count() >= 10
        assert db.query(Debris).count() >= 5
        assert db.query(Alert).count() >= 3
        assert db.query(Mission).count() >= 3
        assert db.query(Incident).count() >= 2
        assert db.query(MarineZone).count() >= 5
    finally:
        db.close()


def test_ais_live_and_simulation():
    """Verify AIS live snapshot and synthetic kinematic fallback simulation step."""
    # 1. Live AIS snapshot
    res = client.get("/api/v1/ais/live")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 10
    vessel_data = data[0]
    assert "vessel_identifier" in vessel_data
    assert "latitude" in vessel_data
    assert "longitude" in vessel_data
    assert "speed_knots" in vessel_data

    # 2. Trigger synthetic AIS step
    res_sim = client.post("/api/v1/ais/simulate")
    assert res_sim.status_code == 200
    sim_data = res_sim.json()
    assert sim_data["status"] == "success"
    assert sim_data["updated_vessels_count"] >= 10


def test_vessel_track_history():
    """Verify historical breadcrumb trail retrieval for a vessel."""
    # Fetch first vessel
    vessels_res = client.get("/api/v1/vessels")
    assert vessels_res.status_code == 200
    vessels = vessels_res.json()
    vessel_id = vessels[0]["id"]

    # Fetch tracks
    tracks_res = client.get(f"/api/v1/vessels/{vessel_id}/tracks")
    assert tracks_res.status_code == 200
    tracks = tracks_res.json()
    assert isinstance(tracks, list)


def test_debris_dataset_and_management():
    """Verify debris sample dataset listing, creation, and updating."""
    # 1. List debris
    res = client.get("/api/v1/debris")
    assert res.status_code == 200
    debris_list = res.json()
    assert len(debris_list) >= 5

    first_item = debris_list[0]
    assert "debris_type" in first_item
    assert "severity" in first_item
    assert "clean_up_priority" in first_item

    # 2. Create new debris report
    new_debris = {
        "latitude": 3.14,
        "longitude": 101.50,
        "debris_type": "plastic_patch",
        "estimated_size_m2": 350.0,
        "density_category": "high",
        "severity": 82.0,
        "clean_up_priority": "urgent",
        "status": "detected",
        "source": "synthetic_sensor"
    }
    create_res = client.post("/api/v1/debris", json=new_debris)
    assert create_res.status_code == 201
    created = create_res.json()
    debris_id = created["id"]
    assert created["severity"] == 82.0

    # 3. Patch debris status
    patch_res = client.patch(f"/api/v1/debris/{debris_id}", json={"status": "dispatch_scheduled"})
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "dispatch_scheduled"


def test_mpa_restricted_zones():
    """Verify MPA and restricted zone GeoJSON can be queried."""
    res = client.get("/api/v1/zones")
    assert res.status_code == 200
    zones = res.json()
    assert len(zones) >= 5

    # Check that at least one zone has restricted=True
    has_restricted = any(z.get("restricted") is True for z in zones)
    assert has_restricted


def test_weather_and_ocean_apis():
    """Verify Weather API and Ocean Current API respond with expected telemetry."""
    # 1. Weather API
    w_res = client.get("/api/v1/weather?lat=1.29&lon=103.85")
    assert w_res.status_code == 200
    weather = w_res.json()
    assert "temperature_c" in weather
    assert "wind_speed_knots" in weather
    assert "wave_height_m" in weather
    assert "conditions" in weather

    # 2. Ocean Currents API
    o_res = client.get("/api/v1/ocean/currents?lat=1.29&lon=103.85")
    assert o_res.status_code == 200
    ocean = o_res.json()
    assert "current_speed_knots" in ocean
    assert "current_direction_deg" in ocean
    assert "sea_surface_temp_c" in ocean
    assert "salinity_psu" in ocean


def test_multi_agent_framework_initialization():
    """Verify all four agents + Orchestrator initialize and register capabilities."""
    res = client.get("/api/v1/agents/status")
    assert res.status_code == 200
    status_data = res.json()

    assert "orchestrator_agent" in status_data
    assert len(status_data["agents"]) == 4

    agent_ids = [a["id"] for a in status_data["agents"]]
    assert "vessel_watch" in agent_ids
    assert "route_planner" in agent_ids
    assert "debris_sentinel" in agent_ids
    assert "compliance" in agent_ids


def test_orchestrator_calls_all_agents():
    """
    Verify complete flow:
    User -> API -> Orchestrator -> Dummy agents (Vessel Watch, Route Planner, Debris Sentinel, Compliance) -> Response
    """
    payload = {
        "query": "Assess navigation safety and environmental compliance for vessel MV Ocean Star transiting near Sri Lanka sanctuary",
        "vessel_id": 1,
        "context": {
            "mission_priority": "high",
            "avoid_restricted_zones": True
        }
    }

    res = client.post("/api/v1/agents/orchestrate", json=payload)
    assert res.status_code == 200
    result = res.json()

    assert "mission_id" in result
    assert result["status"] == "success"
    assert "orchestrator_decision" in result
    assert len(result["recommendations"]) > 0

    # Ensure all four agents contributed findings
    findings = result["agent_findings"]
    assert len(findings) == 4

    agent_names = [f["agent_name"] for f in findings]
    assert "Vessel Watch Agent" in agent_names
    assert "Route Planner Agent" in agent_names
    assert "Debris Sentinel Agent" in agent_names
    assert "Compliance Report Agent" in agent_names or "Compliance Agent" in agent_names

    # Check finding details structure
    for finding in findings:
        assert finding["status"] == "completed"
        assert len(finding["summary"]) > 0
        assert "risk_level" in finding
        assert isinstance(finding["details"], dict)

    # Check human approval and compliance report synthesis
    assert "requires_human_approval" in result
    assert "approval_status" in result
    assert "compliance_report" in result


def test_human_approval_decision_workflow():
    """
    Verify Human Approval & Action/Replan flow:
    Compliance Report Agent -> HUMAN APPROVAL -> ACTION / REPLAN
    """
    # 1. Dispatch mission that triggers orchestrator findings
    orchestrate_payload = {
        "query": "Review critical debris alert and authorize evasive route replan",
        "vessel_id": 1
    }
    orch_res = client.post("/api/v1/agents/orchestrate", json=orchestrate_payload)
    assert orch_res.status_code == 200
    mission_id = orch_res.json()["mission_id"]

    # 2. Submit human approval decision
    approve_payload = {
        "mission_id": mission_id,
        "decision": "approve",
        "action_notes": "Authorized by watch officer"
    }
    dec_res = client.post("/api/v1/agents/decision", json=approve_payload)
    assert dec_res.status_code == 200
    dec_data = dec_res.json()
    assert dec_data["mission_id"] == mission_id
    assert dec_data["decision"] == "approve"
    assert dec_data["approval_status"] == "action_executed"
    assert len(dec_data["action_result"]) > 0

    # 3. Test replan directive
    replan_payload = {
        "mission_id": mission_id,
        "decision": "replan",
        "action_notes": "Avoid northern quadrant"
    }
    replan_res = client.post("/api/v1/agents/decision", json=replan_payload)
    assert replan_res.status_code == 200
    assert replan_res.json()["approval_status"] == "replan_requested"



def test_operations_alerts_and_missions():
    """Verify Alerts, Missions, and Incidents endpoints."""
    # 1. Alerts
    a_res = client.get("/api/v1/alerts")
    assert a_res.status_code == 200
    alerts = a_res.json()
    assert len(alerts) >= 3

    # Acknowledge first alert
    first_alert_id = alerts[0]["id"]
    ack_res = client.patch(f"/api/v1/alerts/{first_alert_id}/ack")
    assert ack_res.status_code == 200
    assert ack_res.json()["acknowledged"] is True

    # 2. Missions
    m_res = client.get("/api/v1/missions")
    assert m_res.status_code == 200
    assert len(m_res.json()) >= 3

    # 3. Incidents
    i_res = client.get("/api/v1/incidents")
    assert i_res.status_code == 200
    assert len(i_res.json()) >= 2


def test_websocket_telemetry_connection():
    """Verify WebSocket /ws/telemetry connects and receives initial handshake."""
    with client.websocket_connect("/ws/telemetry") as websocket:
        data = websocket.receive_json()
        assert data["type"] == "connection_established"
        websocket.send_text("ping")
        resp = websocket.receive_text()
        assert resp == "pong"
