from datetime import datetime, timedelta, timezone

from app.config import settings
from app.models.vessel import Vessel
from app.models.dark_period import DarkPeriod
from app.services.surveillance.ais_gap import AISGap

T0 = datetime(2026, 9, 12, 10, 0, tzinfo=timezone.utc)


def test_ais_gap_threshold_is_configurable_and_defaults_to_thirty_minutes():
    assert settings.AIS_GAP_THRESHOLD_SECONDS == 1800


def test_dark_period_is_built_from_detected_gap_and_persisted(db):
    vessel = Vessel(vessel_identifier="FV-2", name="Trawler", vessel_type="FISHING")
    db.add(vessel)
    db.flush()
    gap = AISGap(
        start_time=T0, end_time=T0 + timedelta(minutes=48), duration_seconds=48 * 60,
        last_latitude=12.0, last_longitude=72.0,
        reappearance_latitude=12.1, reappearance_longitude=72.1, estimated_distance_km=15.6,
    )
    period = DarkPeriod.from_gap(vessel.id, gap)
    db.add(period)
    db.commit()

    stored = db.query(DarkPeriod).one()
    assert stored.vessel_id == vessel.id
    assert stored.duration_seconds == 2880
    assert stored.reappearance_latitude == 12.1
    assert stored.estimated_distance_km == 15.6
    assert stored.severity in ("LOW", "MODERATE", "HIGH", "CRITICAL")


def test_dark_period_severity_grows_with_duration():
    short = AISGap(T0, T0 + timedelta(minutes=35), 35 * 60, 0, 0, 0, 0, 0.0)
    long = AISGap(T0, T0 + timedelta(hours=7), 7 * 3600, 0, 0, 0, 0, 0.0)
    assert DarkPeriod.from_gap(1, short).severity == "LOW"
    assert DarkPeriod.from_gap(1, long).severity == "CRITICAL"
