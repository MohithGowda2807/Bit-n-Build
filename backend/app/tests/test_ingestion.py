from datetime import datetime, timedelta, timezone

from app.models.vessel import Vessel
from app.models.ais_position import AISPosition
from app.models.dark_period import DarkPeriod
from app.services.ais.simulation import SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor

T0 = datetime(2026, 9, 12, 8, 0, tzinfo=timezone.utc)


def test_ingesting_gap_scenario_stores_positions_vessel_and_dark_period(db):
    provider = SimulationAISProvider("AIS_GAP", start_time=T0)
    summary = AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=T0 + timedelta(hours=4))

    vessel = db.query(Vessel).filter_by(mmsi="419000201").one()
    assert vessel.vessel_type == "FISHING"
    assert db.query(AISPosition).filter_by(vessel_id=vessel.id).count() == len(provider.get_positions())
    periods = db.query(DarkPeriod).filter_by(vessel_id=vessel.id).all()
    assert len(periods) == 1
    assert periods[0].duration_seconds == 60 * 60
    assert summary.positions_added == len(provider.get_positions())
    assert summary.dark_periods_added == 1


def test_ingesting_twice_is_idempotent(db):
    provider = SimulationAISProvider("AIS_GAP", start_time=T0)
    ingestor = AISIngestor(db, gap_threshold_seconds=1800)
    ingestor.ingest(provider, now=T0 + timedelta(hours=4))
    second = ingestor.ingest(provider, now=T0 + timedelta(hours=4))

    assert second.positions_added == 0
    assert second.dark_periods_added == 0
    assert db.query(AISPosition).count() == len(provider.get_positions())
    assert db.query(DarkPeriod).count() == 1


def test_vessel_live_position_tracks_latest_report(db):
    provider = SimulationAISProvider("NORMAL_VESSEL", start_time=T0)
    AISIngestor(db, gap_threshold_seconds=1800).ingest(provider, now=T0 + timedelta(hours=4))
    vessel = db.query(Vessel).filter_by(mmsi="353000101").one()
    last = provider.get_positions()[-1]
    assert (vessel.latitude, vessel.longitude) == (last.latitude, last.longitude)
    assert vessel.status == "underway"
