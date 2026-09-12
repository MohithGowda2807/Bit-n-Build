from datetime import datetime, timedelta, timezone

from app.data.surveillance_seed import seed_surveillance_zones
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel import Vessel
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def _ingest(db, scenario):
    seed_surveillance_zones(db)
    provider = SimulationAISProvider(scenario, start_time=T0)
    AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=provider.get_positions()[-1].timestamp)


def test_gap_scenario_produces_gap_and_closed_zone_entry_events(db):
    _ingest(db, "AIS_GAP")
    summary = SurveillancePipeline(db).run()
    vessel = db.query(Vessel).filter_by(mmsi="419000201").one()
    types = {e.event_type for e in db.query(SurveillanceEvent).filter_by(vessel_id=vessel.id)}
    assert {"AIS_GAP_DETECTED", "ZONE_ENTRY", "ZONE_EXIT"} <= types
    gap_event = db.query(SurveillanceEvent).filter_by(event_type="AIS_GAP_DETECTED").one()
    assert gap_event.payload["duration_seconds"] == 3600
    assert gap_event.payload["dark_period_id"]
    zone_entry = db.query(SurveillanceEvent).filter_by(event_type="ZONE_ENTRY").one()
    assert zone_entry.payload["zone_type"] == "NO_FISHING"
    assert summary.events_added == db.query(SurveillanceEvent).count()


def test_pipeline_is_idempotent(db):
    _ingest(db, "AIS_GAP")
    SurveillancePipeline(db).run()
    before = db.query(SurveillanceEvent).count()
    second = SurveillancePipeline(db).run()
    assert second.events_added == 0
    assert db.query(SurveillanceEvent).count() == before


def test_rendezvous_scenario_produces_events_for_both_vessels(db):
    _ingest(db, "VESSEL_RENDEZVOUS")
    SurveillancePipeline(db).run()
    events = db.query(SurveillanceEvent).filter_by(event_type="VESSEL_RENDEZVOUS").all()
    assert len(events) == 2
    assert {e.vessel_id for e in events} == {e.other_vessel_id for e in events}
