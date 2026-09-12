def test_simulation_run_reports_events_and_they_are_queryable(client):
    run = client.post("/api/v1/simulation/run", json={"scenario": "MPA_INTRUSION"}).json()
    assert "events_added" in run

    vessel = client.get("/api/v1/vessels", params={"mmsi": "419000401"}).json()[0]
    events = client.get("/api/v1/surveillance/events", params={"vessel_id": vessel["id"]}).json()
    types = {e["event_type"] for e in events}
    assert {"ZONE_ENTRY", "ZONE_EXIT"} <= types
    entry = next(e for e in events if e["event_type"] == "ZONE_ENTRY")
    assert entry["zone_kind"] == "MARINE_PROTECTED_AREA"
    assert entry["payload"]["zone_type"] == "NO_TAKE"

    filtered = client.get("/api/v1/surveillance/events", params={"event_type": "ZONE_EXIT"}).json()
    assert filtered and all(e["event_type"] == "ZONE_EXIT" for e in filtered)


def test_fishing_zone_and_protected_area_endpoints(client):
    zones = client.get("/api/v1/fishing/zones").json()
    assert {z["zone_type"] for z in zones} == {"NO_FISHING", "RESTRICTED_FISHING", "AUTHORIZED_FISHING"}
    assert zones[0]["geometry"]["type"] == "Polygon"

    areas = client.get("/api/v1/fishing/protected-areas").json()
    assert len(areas) == 1
    assert areas[0]["protection_level"] == "NO_TAKE"


def test_fishing_events_endpoint_lists_fishing_patterns(client):
    client.post("/api/v1/simulation/run", json={"scenario": "SUSPICIOUS_FISHING"})
    events = client.get("/api/v1/fishing/events").json()
    assert events and all(e["event_type"] == "FISHING_PATTERN" for e in events)
    assert events[0]["score"] >= 60
