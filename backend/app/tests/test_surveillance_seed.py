from app.data.surveillance_seed import seed_surveillance_zones
from app.models.fishing_zone import FishingZone
from app.models.marine_protected_area import MarineProtectedArea
from app.services.surveillance.geofence import GeofenceEngine


def test_seeding_is_idempotent_and_covers_scenario_areas(db):
    seed_surveillance_zones(db)
    seed_surveillance_zones(db)
    assert db.query(MarineProtectedArea).count() == 1
    assert db.query(FishingZone).count() == 3

    engine = GeofenceEngine()
    mpa = db.query(MarineProtectedArea).one()
    assert engine.is_inside(13.5, 71.5, mpa)  # MPA_INTRUSION scenario works this square

    no_fishing = db.query(FishingZone).filter_by(zone_type="NO_FISHING").one()
    assert engine.is_inside(12.25, 72.25, no_fishing)  # AIS_GAP scenario reappears here

    authorized = db.query(FishingZone).filter_by(zone_type="AUTHORIZED_FISHING").one()
    assert engine.is_inside(14.0, 72.0, authorized)  # LOITERING scenario sits in legal grounds
