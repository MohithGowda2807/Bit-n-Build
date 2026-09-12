"""Planning a corridor must not rewrite the live voyage unless the caller asks for it."""

MUMBAI = {"latitude": 18.9438, "longitude": 72.8364}
SINGAPORE = {"latitude": 1.29027, "longitude": 103.851959}


def _versions(client):
    return client.get("/api/v1/routes/voyages/1/versions").json()


def _optimize(client, **extra):
    payload = {"vessel_id": 1, "origin": MUMBAI, "destination": SINGAPORE, "mode": "fuel_efficient", **extra}
    response = client.post("/api/v1/routes/optimize", json=payload)
    assert response.status_code == 200, response.text
    return response.json()


def test_optimize_records_a_version_by_default(client):
    before = len(_versions(client))
    _optimize(client)
    after = _versions(client)
    assert len(after) == before + 1
    assert after[-1]["trigger_event"] == "ROUTE_OPTIMIZED"
    assert [v["status"] for v in after].count("active") == 1


def test_optimize_can_plan_without_touching_the_voyage(client):
    before = _versions(client)
    active_route = client.get("/api/v1/voyages/1").json()["route_id"]
    _optimize(client, record_version=False)
    assert len(_versions(client)) == len(before)
    assert client.get("/api/v1/voyages/1").json()["route_id"] == active_route
