from datetime import datetime, timezone

from app.agents.toolkit import SurveillanceToolkit
from app.data.surveillance_seed import seed_surveillance_zones
from app.models.investigation_case import InvestigationCase
from app.models.vessel import Vessel
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _toolkit(db):
    seed_surveillance_zones(db)
    provider = SimulationAISProvider("DARK_FISHING_COMPOSITE", start_time=T0)
    AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=provider.get_positions()[-1].timestamp)
    SurveillancePipeline(db).run()
    RiskService(db).assess_all()
    return SurveillanceToolkit(lambda: db), db.query(Vessel).filter_by(mmsi="419000801").one()


def test_search_vessels_matches_name_or_mmsi_and_includes_risk(db):
    toolkit, vessel = _toolkit(db)
    by_name = toolkit.search_vessels("night")
    by_mmsi = toolkit.search_vessels("419000801")
    assert [v["id"] for v in by_name] == [vessel.id] == [v["id"] for v in by_mmsi]
    assert by_name[0]["risk_level"] == "CRITICAL"


def test_vessel_detail_track_gaps_and_zone_events(db):
    toolkit, vessel = _toolkit(db)
    assert toolkit.get_vessel(vessel.id)["mmsi"] == "419000801"
    track = toolkit.get_vessel_track(vessel.id, hours=24)
    assert track["point_count"] > 20 and len(track["points"]) <= 50
    gaps = toolkit.get_ais_gaps(vessel.id)
    assert len(gaps) == 1 and gaps[0]["duration_minutes"] == 60
    zone_events = toolkit.get_zone_events(vessel.id)
    assert {e["event_type"] for e in zone_events} == {"ZONE_ENTRY", "ZONE_EXIT"}
    assert zone_events[0]["zone_name"]


def test_risk_evidence_and_case_lookups(db):
    toolkit, vessel = _toolkit(db)
    risk = toolkit.get_risk(vessel.id)
    assert risk["score"] > 80 and {f["type"] for f in risk["factors"]} >= {"AIS_GAP", "ZONE_ACTIVITY"}
    evidence = toolkit.get_evidence(vessel.id)
    assert evidence and all("description" in e for e in evidence)
    case = db.query(InvestigationCase).one()
    detail = toolkit.get_investigation_case(case.id)
    assert detail["vessel"]["id"] == vessel.id and detail["evidence_snapshot"]
    assert toolkit.list_open_cases()[0]["id"] == case.id
    assert vessel.id in [v["vessel_id"] for v in toolkit.list_high_risk_vessels(min_score=60)]


def test_unknown_ids_return_error_dicts_not_exceptions(db):
    toolkit, _ = _toolkit(db)
    assert "error" in toolkit.get_vessel(999)
    assert "error" in toolkit.get_risk(999)
    assert "error" in toolkit.get_investigation_case(999)
    assert toolkit.search_vessels("zzz-no-such-vessel") == []
