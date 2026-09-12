from datetime import datetime, timezone

from app.data.surveillance_seed import seed_surveillance_zones
from app.events.publisher import Event, InMemoryEventPublisher
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def test_in_memory_publisher_stores_and_notifies():
    publisher = InMemoryEventPublisher()
    seen = []
    publisher.subscribe(seen.append)
    event = Event(event_type="AIS_GAP_DETECTED", source="ais_agent", vessel_id=7, payload={"gap_duration_minutes": 48})
    publisher.publish(event)
    assert seen == [event]
    assert publisher.recent()[0].event_type == "AIS_GAP_DETECTED"
    assert publisher.recent()[0].timestamp is not None
    assert event.as_dict()["payload"]["gap_duration_minutes"] == 48


def test_recent_returns_newest_first_and_respects_limit():
    publisher = InMemoryEventPublisher()
    for i in range(5):
        publisher.publish(Event(event_type=f"E{i}", source="test"))
    assert [e.event_type for e in publisher.recent(limit=2)] == ["E4", "E3"]


def _prepare(db, scenario):
    seed_surveillance_zones(db)
    provider = SimulationAISProvider(scenario, start_time=T0)
    AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=provider.get_positions()[-1].timestamp)


def test_pipeline_publishes_each_new_surveillance_event(db):
    _prepare(db, "AIS_GAP")
    publisher = InMemoryEventPublisher()
    summary = SurveillancePipeline(db, publisher=publisher).run()
    published = publisher.recent(limit=100)
    assert len(published) == summary.events_added
    assert {e.event_type for e in published} >= {"AIS_GAP_DETECTED", "ZONE_ENTRY"}
    assert all(e.source == "surveillance_pipeline" and e.vessel_id for e in published)


def test_risk_service_publishes_alert_and_case_events(db):
    _prepare(db, "DARK_FISHING_COMPOSITE")
    SurveillancePipeline(db).run()
    publisher = InMemoryEventPublisher()
    RiskService(db, publisher=publisher).assess_all()
    types = [e.event_type for e in publisher.recent(limit=100)]
    assert "HIGH_RISK_VESSEL" in types
    assert "CASE_CREATED" in types
    case_event = next(e for e in publisher.recent(limit=100) if e.event_type == "CASE_CREATED")
    assert case_event.payload["risk_score"] > 80 and case_event.payload["case_id"]
