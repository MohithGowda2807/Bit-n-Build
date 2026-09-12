from datetime import datetime, timezone

from app.config import settings
from app.data.surveillance_seed import seed_surveillance_zones
from app.models.evidence import Evidence
from app.models.investigation_case import InvestigationCase
from app.models.vessel import Vessel
from app.models.vessel_risk_score import VesselRiskScore
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _prepare(db, scenario):
    seed_surveillance_zones(db)
    provider = SimulationAISProvider(scenario, start_time=T0)
    AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=provider.get_positions()[-1].timestamp)
    SurveillancePipeline(db).run()


def test_thresholds_are_configurable():
    assert settings.RISK_ALERT_THRESHOLD == 60
    assert settings.RISK_CASE_THRESHOLD == 80


def test_gap_scenario_gets_a_stored_risk_score_with_evidence_but_no_case(db):
    _prepare(db, "AIS_GAP")
    RiskService(db).assess_all()
    vessel = db.query(Vessel).filter_by(mmsi="419000201").one()
    risk = RiskService(db).latest_for(vessel.id)
    assert 40 < risk.score <= 80
    assert {f["type"] for f in risk.factors} == {"AIS_GAP", "ZONE_ACTIVITY"}
    evidence_types = {e.evidence_type for e in db.query(Evidence).filter_by(risk_score_id=risk.id)}
    assert {"AIS_GAP", "ZONE_ENTRY"} <= evidence_types
    assert db.query(InvestigationCase).count() == 0


def test_composite_scenario_opens_a_critical_case_with_evidence_snapshot(db):
    _prepare(db, "DARK_FISHING_COMPOSITE")
    summary = RiskService(db).assess_all()
    assert summary.cases_opened == 1
    case = db.query(InvestigationCase).one()
    vessel = db.get(Vessel, case.vessel_id)
    assert vessel.vessel_type == "FISHING"
    assert case.risk_score > 80
    assert case.risk_level == "CRITICAL"
    assert case.status == "OPEN"
    assert len(case.evidence_snapshot) >= 4
    assert {e["evidence_type"] for e in case.evidence_snapshot} >= {"AIS_GAP", "ZONE_ENTRY", "FISHING_PATTERN", "VESSEL_RENDEZVOUS"}
    assert "AIS gap" in case.summary
    assert case.audit_log[0]["action"] == "CASE_CREATED"


def test_reassessing_updates_the_open_case_instead_of_duplicating(db):
    _prepare(db, "DARK_FISHING_COMPOSITE")
    RiskService(db).assess_all()
    second = RiskService(db).assess_all()
    assert second.cases_opened == 0
    assert db.query(InvestigationCase).count() == 1
    case = db.query(InvestigationCase).one()
    assert [entry["action"] for entry in case.audit_log] == ["CASE_CREATED", "RISK_UPDATED"]
    assert db.query(VesselRiskScore).filter_by(vessel_id=case.vessel_id).count() == 2


def test_case_workflow_assign_resolve_dismiss(db):
    _prepare(db, "DARK_FISHING_COMPOSITE")
    service = RiskService(db)
    service.assess_all()
    case = db.query(InvestigationCase).one()

    service.assign_case(case.id, "analyst.a", actor="operator")
    assert case.status == "UNDER_REVIEW" and case.assigned_to == "analyst.a"

    service.dismiss_case(case.id, reason="AIS_EQUIPMENT_FAILURE", actor="analyst.a", note="Owner sent repair log")
    assert case.status == "DISMISSED"
    assert case.dismissed_reason == "AIS_EQUIPMENT_FAILURE"
    assert [entry["action"] for entry in case.audit_log][-2:] == ["CASE_ASSIGNED", "CASE_DISMISSED"]

    # A dismissed case is closed; reassessment opens a fresh one rather than reviving it.
    service.assess_all()
    assert db.query(InvestigationCase).count() == 2


def test_dismiss_requires_a_known_reason(db):
    import pytest
    _prepare(db, "DARK_FISHING_COMPOSITE")
    service = RiskService(db)
    service.assess_all()
    case = db.query(InvestigationCase).one()
    with pytest.raises(ValueError):
        service.dismiss_case(case.id, reason="BECAUSE", actor="x")


def test_evidence_descriptions_use_clock_times_not_iso_strings(db):
    from app.models.evidence import Evidence

    _prepare(db, "AIS_GAP")
    RiskService(db).assess_all()
    gap = db.query(Evidence).filter_by(evidence_type="AIS_GAP").first()
    assert gap is not None
    assert "T" not in gap.description.split("starting")[-1]
    assert gap.description.startswith("AIS gap of 60 minutes starting ")
    assert len(gap.description.split("starting ")[-1]) == 5  # HH:MM
