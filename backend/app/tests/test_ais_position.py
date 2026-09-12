from datetime import datetime, timezone

from app.models.vessel import Vessel
from app.models.ais_position import AISPosition


def _vessel():
    return Vessel(vessel_identifier="FV-1", name="Trawler", vessel_type="FISHING", mmsi="419000001")


def test_ais_positions_are_returned_in_time_order_for_a_vessel(db):
    vessel = _vessel()
    db.add(vessel)
    db.flush()
    t0 = datetime(2026, 9, 12, 10, 0, tzinfo=timezone.utc)
    later = AISPosition(vessel_id=vessel.id, timestamp=t0.replace(minute=5), latitude=12.0, longitude=72.0,
                        speed_over_ground=6.5, course_over_ground=180.0, source="SIMULATION")
    earlier = AISPosition(vessel_id=vessel.id, timestamp=t0, latitude=12.1, longitude=72.1,
                          speed_over_ground=6.0, course_over_ground=181.0, source="SIMULATION")
    db.add_all([later, earlier])
    db.commit()

    rows = db.query(AISPosition).filter_by(vessel_id=vessel.id).order_by(AISPosition.timestamp).all()
    assert [r.latitude for r in rows] == [12.1, 12.0]
    assert rows[0].received_at is not None
    assert rows[0].navigation_status is None
