from datetime import datetime, timezone

from app.services.surveillance.analyzer import DetectedEvent
from app.services.surveillance.risk import MAX_BEHAVIOR_DEVIATION, assess_risk

T0 = datetime(2026, 9, 12, 10, 0, tzinfo=timezone.utc)


def _run(client, scenario):
    return client.post("/api/v1/simulation/run", json={"scenario": scenario}).json()


def _vessel_id(client, mmsi):
    return client.get("/api/v1/vessels", params={"mmsi": mmsi}).json()[0]["id"]


def _deviation(score):
    return DetectedEvent("BEHAVIOR_DEVIATION", 1, T0, 12.0, 72.0, score=score, confidence=0.8,
                         payload={"explanation": "usually 8.0 kn, now 3.0 kn (5.0 sd below)", "baseline_speed": 8.0})


def test_behavior_deviation_is_a_capped_fifth_risk_factor():
    partial = assess_risk("FISHING", [_deviation(80)])
    assert [f.factor_type for f in partial.factors] == ["BEHAVIOR_DEVIATION"]
    assert partial.factors[0].score == round(MAX_BEHAVIOR_DEVIATION * 0.8)
    assert "usually 8.0 kn" in partial.factors[0].explanation
    assert assess_risk("FISHING", [_deviation(100)]).score == MAX_BEHAVIOR_DEVIATION


def test_composite_scenario_profiles_the_vessel_and_flags_its_deviation(client):
    _run(client, "DARK_FISHING_COMPOSITE")
    vessel_id = _vessel_id(client, "419000801")

    baseline = client.get(f"/api/v1/vessels/{vessel_id}/baseline")
    assert baseline.status_code == 200
    body = baseline.json()
    assert body["profile"]["average_speed"] > 0 and body["profile"]["point_count"] >= 6
    assert body["profile"]["common_cells"] and body["profile"]["source"] == "HISTORICAL"
    assert body["deviation"]["score"] > 40
    assert "usually" in body["deviation"]["explanation"]

    events = client.get("/api/v1/surveillance/events", params={"vessel_id": vessel_id, "limit": 100}).json()
    assert any(e["event_type"] == "BEHAVIOR_DEVIATION" for e in events)
    risk = client.get(f"/api/v1/vessels/{vessel_id}/risk").json()
    assert "BEHAVIOR_DEVIATION" in {f["type"] for f in risk["factors"]}


def test_steady_transit_has_a_profile_but_no_deviation_event(client):
    _run(client, "NORMAL_VESSEL")
    vessel_id = _vessel_id(client, "353000101")
    body = client.get(f"/api/v1/vessels/{vessel_id}/baseline").json()
    assert body["profile"]["point_count"] >= 6
    assert body["deviation"] is None or body["deviation"]["score"] <= 40
    events = client.get("/api/v1/surveillance/events", params={"vessel_id": vessel_id, "limit": 100}).json()
    assert not any(e["event_type"] == "BEHAVIOR_DEVIATION" for e in events)


def test_vessel_without_track_has_no_baseline(client):
    vessel_id = client.get("/api/v1/vessels").json()[0]["id"]  # Phase 1 seed vessel, no AIS
    response = client.get(f"/api/v1/vessels/{vessel_id}/baseline")
    assert response.status_code == 404
    assert response.json()["detail"]["code"] == "NO_BASELINE"
