import json
from datetime import datetime, timezone

import pytest

from app.agents.crew import (
    LLMNotConfiguredError, ask_maritime_ai, build_assistant_crew, build_surveillance_crew,
    investigate_vessel, llm_configured,
)
from app.agents.crew_tools import build_tools
from app.agents.toolkit import SurveillanceToolkit
from app.config import settings
from app.data.surveillance_seed import seed_surveillance_zones
from app.models.vessel import Vessel
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)
EXPECTED_TOOLS = {
    "search_vessels", "get_vessel", "get_vessel_track", "get_ais_gaps", "get_zone_events", "get_events",
    "get_risk", "get_evidence", "list_high_risk_vessels", "get_investigation_case", "list_open_cases",
    # Phase 4 added the cleanup and debris tools to the same assistant.
    "list_debris_hazards", "get_debris_drift_forecast", "list_cleanup_fleet", "plan_cleanup_mission_tool",
}


@pytest.fixture
def no_llm(monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_API_KEY", "")


@pytest.fixture
def offline_llm():
    """A Gemini LLM object built with a placeholder key; constructing it makes no network call."""
    from crewai import LLM
    return LLM(model=settings.GEMINI_MODEL, api_key="placeholder-for-tests")


def test_llm_is_not_configured_without_a_key(no_llm):
    assert llm_configured() is False


def test_tools_wrap_the_toolkit_and_return_json(db):
    seed_surveillance_zones(db)
    provider = SimulationAISProvider("AIS_GAP", start_time=T0)
    AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=provider.get_positions()[-1].timestamp)
    SurveillancePipeline(db).run()
    RiskService(db).assess_all()
    vessel = db.query(Vessel).filter_by(mmsi="419000201").one()

    tools = {t.name: t for t in build_tools(SurveillanceToolkit(lambda: db))}
    assert set(tools) == EXPECTED_TOOLS
    assert all(t.description for t in tools.values())
    gaps = json.loads(tools["get_ais_gaps"].run(vessel_id=vessel.id))
    assert gaps[0]["duration_minutes"] == 60
    assert json.loads(tools["get_risk"].run(vessel_id=vessel.id))["score"] > 40


def test_surveillance_crew_has_four_specialist_agents_with_tools(offline_llm):
    crew = build_surveillance_crew(vessel_id=1, llm=offline_llm)
    roles = [agent.role for agent in crew.agents]
    assert len(crew.agents) == 4 and len(crew.tasks) == 4
    assert any("AIS" in r for r in roles) and any("Fishing" in r for r in roles)
    assert any("Anomaly" in r for r in roles) and any("Investigation" in r for r in roles)
    assert all(agent.tools for agent in crew.agents)
    assert "vessel 1" in crew.tasks[0].description.lower()


def test_assistant_crew_has_one_agent_with_every_tool(offline_llm):
    crew = build_assistant_crew("Why is vessel 1 high risk?", llm=offline_llm)
    assert len(crew.agents) == 1
    assert {t.name for t in crew.agents[0].tools} == EXPECTED_TOOLS
    assert "invent" in crew.agents[0].backstory.lower() or "never" in crew.agents[0].backstory.lower()


def test_llm_entry_points_fail_clearly_without_a_key(no_llm):
    with pytest.raises(LLMNotConfiguredError):
        ask_maritime_ai("Show high-risk vessels")
    with pytest.raises(LLMNotConfiguredError):
        investigate_vessel(1)


def test_crews_are_rate_limited_from_settings(offline_llm, monkeypatch):
    monkeypatch.setattr(settings, "GEMINI_MAX_RPM", 7)
    assert build_surveillance_crew(vessel_id=1, llm=offline_llm).max_rpm == 7
    assert build_assistant_crew("q", llm=offline_llm).max_rpm == 7


def test_provider_failures_become_agent_run_errors(monkeypatch):
    from app.agents import crew
    from app.agents.crew import AgentRunError

    monkeypatch.setattr(settings, "GEMINI_API_KEY", "placeholder")

    class Boom:
        def kickoff(self):
            raise RuntimeError("429 RESOURCE_EXHAUSTED quota exceeded")

    monkeypatch.setattr(crew, "build_assistant_crew", lambda *a, **k: Boom())
    monkeypatch.setattr(crew, "build_surveillance_crew", lambda *a, **k: Boom())
    with pytest.raises(AgentRunError, match="quota"):
        ask_maritime_ai("anything")
    with pytest.raises(AgentRunError):
        investigate_vessel(1)



def test_every_tool_schema_declares_properties_for_strict_providers(db):
    """Groq rejects tool schemas with 'required' but no 'properties'; zero-arg tools need an optional parameter."""
    for tool in build_tools(SurveillanceToolkit(lambda: db)):
        schema = tool.args_schema.model_json_schema()
        assert schema.get("properties"), f"{tool.name} has no parameters in its schema"
