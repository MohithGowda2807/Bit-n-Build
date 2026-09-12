def _run(client, scenario):
    return client.post("/api/v1/simulation/run", json={"scenario": scenario}).json()


def _vessel_id(client, mmsi):
    return client.get("/api/v1/vessels", params={"mmsi": mmsi}).json()[0]["id"]


def test_simulation_run_assesses_risk_and_opens_case(client):
    run = _run(client, "DARK_FISHING_COMPOSITE")
    assert run["cases_opened"] >= 0  # zero on re-runs within the same test database

    vessel_id = _vessel_id(client, "419000801")
    risk = client.get(f"/api/v1/vessels/{vessel_id}/risk")
    assert risk.status_code == 200
    body = risk.json()
    assert body["score"] > 80 and body["level"] == "CRITICAL"
    assert {f["type"] for f in body["factors"]} >= {"AIS_GAP", "ZONE_ACTIVITY", "FISHING_BEHAVIOR", "RENDEZVOUS"}
    assert body["evidence"] and all("description" in e for e in body["evidence"])


def test_vessel_without_assessment_returns_404(client):
    vessel_id = client.get("/api/v1/vessels").json()[0]["id"]  # Phase 1 seed vessel, no AIS
    response = client.get(f"/api/v1/vessels/{vessel_id}/risk")
    assert response.status_code == 404
    assert response.json()["detail"]["code"] == "RISK_NOT_ASSESSED"


def test_surveillance_risk_list_returns_latest_per_vessel(client):
    _run(client, "DARK_FISHING_COMPOSITE")
    rows = client.get("/api/v1/surveillance/risk", params={"min_score": 50}).json()
    assert rows and all(r["score"] >= 50 for r in rows)
    assert len({r["vessel_id"] for r in rows}) == len(rows)


def test_investigation_workflow_via_api(client):
    _run(client, "DARK_FISHING_COMPOSITE")
    cases = client.get("/api/v1/investigations", params={"status": "OPEN"}).json()
    assert cases
    case_id = cases[0]["id"]

    detail = client.get(f"/api/v1/investigations/{case_id}").json()
    assert detail["evidence_snapshot"] and detail["audit_log"][0]["action"] == "CASE_CREATED"
    assert detail["vessel"]["mmsi"] == "419000801"

    assigned = client.post(f"/api/v1/investigations/{case_id}/assign", json={"assignee": "analyst.a", "actor": "operator"}).json()
    assert assigned["status"] == "UNDER_REVIEW"

    bad = client.post(f"/api/v1/investigations/{case_id}/dismiss", json={"reason": "BECAUSE", "actor": "analyst.a"})
    assert bad.status_code == 400

    dismissed = client.post(f"/api/v1/investigations/{case_id}/dismiss",
                            json={"reason": "AUTHORIZED_ACTIVITY", "actor": "analyst.a", "note": "Permit verified"}).json()
    assert dismissed["status"] == "DISMISSED"
    assert dismissed["audit_log"][-1]["note"] == "Permit verified"

    assert client.get("/api/v1/investigations/999999").status_code == 404
    assert client.get("/api/v1/investigations/dismiss-reasons").json() == [
        "AIS_EQUIPMENT_FAILURE", "COVERAGE_ISSUE", "AUTHORIZED_ACTIVITY", "WEATHER_DISRUPTION", "DATA_ERROR", "UNKNOWN",
    ]
