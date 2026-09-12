def test_running_a_simulation_scenario_creates_dark_periods_via_api(client):
    run = client.post("/api/v1/simulation/run", json={"scenario": "AIS_GAP"})
    assert run.status_code == 200, run.text
    body = run.json()
    assert body["scenario"] == "AIS_GAP"
    assert body["positions_added"] >= 0

    gaps = client.get("/api/v1/ais/gaps").json()
    assert any(g["duration_seconds"] == 3600 for g in gaps)
    gap = gaps[0]
    detail = client.get(f"/api/v1/ais/gaps/{gap['id']}")
    assert detail.status_code == 200
    assert detail.json()["severity"] in ("LOW", "MODERATE", "HIGH", "CRITICAL")


def test_vessel_track_endpoint_returns_ordered_positions(client):
    client.post("/api/v1/simulation/run", json={"scenario": "NORMAL_VESSEL"})
    vessels = client.get("/api/v1/vessels", params={"mmsi": "353000101"}).json()
    assert len(vessels) == 1
    track = client.get(f"/api/v1/vessels/{vessels[0]['id']}/track").json()
    assert len(track) > 20
    timestamps = [p["timestamp"] for p in track]
    assert timestamps == sorted(timestamps)
    assert {"latitude", "longitude", "speed_over_ground", "course_over_ground"} <= set(track[0])


def test_unknown_scenario_returns_400(client):
    response = client.post("/api/v1/simulation/run", json={"scenario": "NOPE"})
    assert response.status_code == 400
    assert response.json()["detail"]["code"] == "UNKNOWN_SCENARIO"


def test_scenario_catalogue_lists_all_seven(client):
    response = client.get("/api/v1/simulation/scenarios")
    assert response.status_code == 200
    assert len(response.json()) >= 7


def test_rerunning_a_scenario_resets_its_previous_data(client):
    first = client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"}).json()
    second = client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"}).json()
    assert second["positions_added"] == first["positions_added"]
    assert second["reset"] is True

    vessel = client.get("/api/v1/vessels", params={"mmsi": "419000801"}).json()[0]
    track = client.get(f"/api/v1/vessels/{vessel['id']}/track").json()
    assert 0 < len(track) < first["positions_added"]  # one vessel's share of the two-vessel scenario
    assert len({p["timestamp"] for p in track}) == len(track)  # no duplicated copies of the track
    gaps = client.get("/api/v1/ais/gaps", params={"vessel_id": vessel["id"]}).json()
    assert len(gaps) == 1
    cases = client.get("/api/v1/investigations", params={"vessel_id": vessel["id"]}).json()
    assert len(cases) == 1
    events = client.get("/api/v1/surveillance/events", params={"vessel_id": vessel["id"], "limit": 2000}).json()
    assert len({e["event_type"] for e in events}) >= 4
    assert len([e for e in events if e["event_type"] == "AIS_GAP_DETECTED"]) == 1


def test_scenario_run_can_keep_history_when_asked(client):
    client.post("/api/v1/simulation/run", json={"scenario": "NORMAL_VESSEL"})
    kept = client.post("/api/v1/simulation/run", json={"scenario": "NORMAL_VESSEL", "reset": False}).json()
    assert kept["reset"] is False


def test_reset_endpoint_removes_all_simulated_vessels_and_their_data(client):
    client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
    assert client.get("/api/v1/investigations").json()
    wiped = client.post("/api/v1/simulation/reset").json()
    assert wiped["vessels_removed"] >= 2
    assert client.get("/api/v1/investigations").json() == []
    assert client.get("/api/v1/vessels", params={"mmsi": "419000801"}).json() == []
    assert client.get("/api/v1/ais/gaps").json() == []
    assert len(client.get("/api/v1/vessels").json()) >= 10  # Phase 1 seed vessels untouched
