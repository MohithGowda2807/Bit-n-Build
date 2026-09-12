def _run(client, scenario):
    return client.post("/api/v1/simulation/run", json={"scenario": scenario}).json()


def test_heatmap_aggregates_positions_events_and_risk_per_cell(client):
    _run(client, "DARK_FISHING_COMPOSITE")
    response = client.get("/api/v1/surveillance/heatmap", params={"cell_degrees": 0.25})
    assert response.status_code == 200
    body = response.json()
    assert body["cell_degrees"] == 0.25
    cells = body["cells"]
    assert cells, "the composite scenario leaves AIS positions on the map"
    for cell in cells:
        assert {"lat", "lon", "positions", "events", "max_risk", "intensity"} <= set(cell)
        assert 0.0 <= cell["intensity"] <= 1.0
        assert cell["lat"] % 0.25 == 0 and cell["lon"] % 0.25 == 0
    # FV Night Hauler works the closed bank around 12.2 N 72.2 E; that cell carries events and its risk.
    bank = next(c for c in cells if c["lat"] == 12.0 and c["lon"] == 72.0)
    assert bank["positions"] > 0 and bank["events"] > 0 and bank["max_risk"] >= 80
    assert max(c["intensity"] for c in cells) == 1.0


def test_heatmap_is_empty_without_positions_and_rejects_bad_cells(client):
    client.post("/api/v1/simulation/reset")
    assert client.get("/api/v1/surveillance/heatmap").json()["cells"] == []
    assert client.get("/api/v1/surveillance/heatmap", params={"cell_degrees": 0}).status_code == 422
