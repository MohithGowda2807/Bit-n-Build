"""CrewAI tool wrappers over the deterministic SurveillanceToolkit."""
import json
from typing import List

from app.agents.toolkit import SurveillanceToolkit

TOOL_NAMES = [
    "search_vessels", "get_vessel", "get_vessel_track", "get_ais_gaps", "get_zone_events", "get_events",
    "get_risk", "get_evidence", "list_high_risk_vessels", "get_investigation_case", "list_open_cases",
]


def _dump(value) -> str:
    return json.dumps(value, default=str)


def build_tools(toolkit: SurveillanceToolkit) -> List:
    """Build the tool set bound to one toolkit (and therefore one database session)."""
    from crewai.tools import tool

    @tool("search_vessels")
    def search_vessels(query: str) -> str:
        """Search vessels by name, MMSI, IMO or identifier. Returns a JSON list with each vessel's current risk."""
        return _dump(toolkit.search_vessels(query))

    @tool("get_vessel")
    def get_vessel(vessel_id: int) -> str:
        """Get identity, type, flag, live position and current risk for one vessel id."""
        return _dump(toolkit.get_vessel(vessel_id))

    @tool("get_vessel_track")
    def get_vessel_track(vessel_id: int, hours: float = 24) -> str:
        """Get the vessel's recent AIS track (sampled points with time, position, speed, course) for the last N hours."""
        return _dump(toolkit.get_vessel_track(vessel_id, hours))

    @tool("get_ais_gaps")
    def get_ais_gaps(vessel_id: int) -> str:
        """List detected AIS gaps (dark periods) for a vessel: start, end, duration in minutes, last and reappearance positions."""
        return _dump(toolkit.get_ais_gaps(vessel_id))

    @tool("get_zone_events")
    def get_zone_events(vessel_id: int) -> str:
        """List fishing-zone and protected-area entry and exit events for a vessel, with zone names, types and dwell time."""
        return _dump(toolkit.get_zone_events(vessel_id))

    @tool("get_events")
    def get_events(vessel_id: int) -> str:
        """List every detected surveillance event for a vessel: AIS gaps, zone events, loitering, fishing patterns, rendezvous."""
        return _dump(toolkit.get_events(vessel_id))

    @tool("get_risk")
    def get_risk(vessel_id: int) -> str:
        """Get the vessel's latest risk score (0-100), level, and the weighted factors that produced it."""
        return _dump(toolkit.get_risk(vessel_id))

    @tool("get_evidence")
    def get_evidence(vessel_id: int) -> str:
        """List the evidence items behind the vessel's latest risk score, each with type, strength, confidence and description."""
        return _dump(toolkit.get_evidence(vessel_id))

    @tool("list_high_risk_vessels")
    def list_high_risk_vessels(min_score: float = 60) -> str:
        """List vessels whose latest risk score is at least min_score, highest first."""
        return _dump(toolkit.list_high_risk_vessels(min_score))

    @tool("get_investigation_case")
    def get_investigation_case(case_id: int) -> str:
        """Get an investigation case with its status, summary, frozen evidence snapshot and audit log."""
        return _dump(toolkit.get_investigation_case(case_id))

    @tool("list_open_cases")
    def list_open_cases(limit: int = 20) -> str:
        """List up to `limit` investigation cases that are still open, highest risk first."""
        return _dump(toolkit.list_open_cases(limit))

    return [
        search_vessels, get_vessel, get_vessel_track, get_ais_gaps, get_zone_events, get_events,
        get_risk, get_evidence, list_high_risk_vessels, get_investigation_case, list_open_cases,
    ]
