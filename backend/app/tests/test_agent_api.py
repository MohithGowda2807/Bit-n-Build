import pytest

from app.config import settings


@pytest.fixture
def no_llm(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")


def test_ask_endpoint_reports_llm_not_configured(client, no_llm):
    response = client.post("/api/v1/assistant/ask", json={"question": "Which vessels have AIS gaps?"})
    assert response.status_code == 503
    assert response.json()["detail"]["code"] == "LLM_NOT_CONFIGURED"


def test_assistant_status_endpoint(client, no_llm):
    body = client.get("/api/v1/assistant/status").json()
    assert body["llm_configured"] is False
    assert body["model"] == settings.GEMINI_MODEL
    assert set(body["tools"]) >= {"get_risk", "get_evidence"}


def test_case_analyze_endpoint_reports_llm_not_configured(client, no_llm):
    client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
    case_id = client.get("/api/v1/investigations").json()[0]["id"]
    response = client.post(f"/api/v1/investigations/{case_id}/analyze")
    assert response.status_code == 503


def test_run_cycle_endpoint_runs_pipeline_and_risk(client):
    client.post("/api/v1/simulation/run", json={"scenario": "AIS_GAP"})
    body = client.post("/api/v1/surveillance/run-cycle").json()
    assert {"vessels_analyzed", "events_added", "vessels_assessed", "cases_opened"} <= set(body)
    assert body["vessels_assessed"] >= 1


def test_agent_failures_return_502_not_500(client, monkeypatch):
    from app.agents.crew import AgentRunError
    from app.api import assistant, investigations

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "placeholder")
    monkeypatch.setattr(assistant, "ask_maritime_ai", lambda q: (_ for _ in ()).throw(AgentRunError("429 quota exceeded")))
    response = client.post("/api/v1/assistant/ask", json={"question": "Which vessels have AIS gaps?"})
    assert response.status_code == 502
    assert response.json()["detail"]["code"] == "AGENT_RUN_FAILED"
    assert "quota" in response.json()["detail"]["message"]

    client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
    case_id = client.get("/api/v1/investigations").json()[0]["id"]
    monkeypatch.setattr(investigations, "investigate_vessel", lambda v: (_ for _ in ()).throw(AgentRunError("boom")))
    assert client.post(f"/api/v1/investigations/{case_id}/analyze").status_code == 502


def test_status_lists_provider_chain(client, monkeypatch):
    monkeypatch.setattr(settings, "GROQ_API_KEY", "q")
    body = client.get("/api/v1/assistant/status").json()
    names = [p["name"] for p in body["providers"]]
    assert names == ["groq", "gemini", "openrouter"]
    assert body["llm_configured"] is True
    assert next(p for p in body["providers"] if p["name"] == "groq")["configured"] is True


def test_ask_reports_which_provider_answered(client, monkeypatch):
    from app.agents.crew import AgentResult
    from app.api import assistant

    monkeypatch.setattr(settings, "GROQ_API_KEY", "q")
    monkeypatch.setattr(assistant, "ask_maritime_ai", lambda q: AgentResult(text="42 vessels", provider="groq", model="m"))
    body = client.post("/api/v1/assistant/ask", json={"question": "How many vessels?"}).json()
    assert body["answer"] == "42 vessels" and body["provider"] == "groq" and body["model"] == "m"
