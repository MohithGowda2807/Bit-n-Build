"""Wiring between Prajwal's TRITON layer and the Phase 3 surveillance layer."""


def _scenario_vessel(client):
    client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
    return client.get("/api/v1/vessels", params={"mmsi": "419000801"}).json()[0]


def test_vessel_watch_agent_reports_surveillance_risk(client):
    vessel = _scenario_vessel(client)
    result = client.post("/api/v1/agents/orchestrate", json={
        "query": "Assess vessel behaviour", "vessel_id": vessel["id"],
    }).json()
    watch = next(f for f in result["agent_findings"] if f["agent_name"] == "Vessel Watch Agent")
    assert watch["risk_level"] == "critical"
    assert watch["details"]["surveillance"]["score"] == 100
    assert watch["details"]["surveillance"]["factors"][0]["type"] in ("FISHING_BEHAVIOR", "ZONE_ACTIVITY")
    assert "100/100" in watch["summary"]


def test_vessel_watch_agent_still_works_for_seed_vessels_without_assessment(client):
    seed = client.get("/api/v1/vessels").json()[0]
    result = client.post("/api/v1/agents/orchestrate", json={"query": "Check status", "vessel_id": seed["id"]}).json()
    watch = next(f for f in result["agent_findings"] if f["agent_name"] == "Vessel Watch Agent")
    assert watch["status"] == "completed"
    assert "surveillance" not in watch["details"]


def test_kinematic_simulation_step_leaves_scenario_vessels_in_place(client):
    vessel = _scenario_vessel(client)
    before = (vessel["latitude"], vessel["longitude"])
    step = client.post("/api/v1/ais/simulate").json()
    assert step["updated_vessels_count"] >= 10
    after = client.get(f"/api/v1/vessels/{vessel['id']}").json()
    assert (after["latitude"], after["longitude"]) == before


def test_replay_streams_scenario_steps_over_websocket(client):
    with client.websocket_connect("/ws/telemetry") as ws:
        assert ws.receive_json()["type"] == "connection_established"
        started = client.post("/api/v1/simulation/replay", json={"scenario": "AIS_GAP", "step_seconds": 0.01}).json()
        assert started["status"] == "started" and started["steps"] == 38  # 49 five-minute reports minus the 11 dark ones
        steps, done = [], None
        for _ in range(2000):
            message = ws.receive_json()
            if message["type"] == "replay_step":
                steps.append(message["data"])
            elif message["type"] == "replay_complete":
                done = message["data"]
                break
        assert done and done["scenario"] == "AIS_GAP"
        assert len(steps) == started["steps"]
        assert steps[0]["progress"] < steps[-1]["progress"] == 1.0
        assert steps[0]["vessels"][0]["mmsi"] == "419000201"
        assert all("sim_time" in s for s in steps)
    vessel = client.get("/api/v1/vessels", params={"mmsi": "419000201"}).json()[0]
    assert abs(vessel["latitude"] - steps[-1]["vessels"][0]["latitude"]) < 1e-6


def test_orchestrator_falls_through_to_assistant_for_questions(client, monkeypatch):
    from app.agents import triton_crew
    from app.agents.crew import AgentResult
    from app.config import settings

    monkeypatch.setattr(settings, "GROQ_API_KEY", "placeholder")
    asked = []

    def fake_ask(question):
        asked.append(question)
        return AgentResult(text="Vessel 11 is high risk because of a 60 minute AIS gap.", provider="groq", model="m")

    monkeypatch.setattr(triton_crew, "ask_maritime_ai", fake_ask)
    vessel = _scenario_vessel(client)

    question = client.post("/api/v1/agents/orchestrate", json={"query": "Why is vessel 11 high risk?", "vessel_id": vessel["id"]}).json()
    assert question["assistant_answer"].startswith("Vessel 11 is high risk")
    assert question["assistant_provider"] == "groq"
    assert asked == ["Why is vessel 11 high risk?"]

    directive = client.post("/api/v1/agents/orchestrate", json={"query": "Assess navigation safety", "vessel_id": vessel["id"]}).json()
    assert directive["assistant_answer"] is None
    assert len(asked) == 1

    forced = client.post("/api/v1/agents/orchestrate", json={"query": "Assess navigation safety", "vessel_id": vessel["id"], "use_assistant": True}).json()
    assert forced["assistant_provider"] == "groq"


def test_orchestrator_skips_assistant_without_any_provider(client):
    result = client.post("/api/v1/agents/orchestrate", json={"query": "Which vessels have AIS gaps?"}).json()
    assert result["status"] == "success"
    assert result.get("assistant_answer") is None
