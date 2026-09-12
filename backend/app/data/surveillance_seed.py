"""Deterministic fishing zones and protected areas matching the simulation scenarios.

Locations are fictional demo geometry in the eastern Arabian Sea, not real designations.
"""
import json
from sqlalchemy.orm import Session

from app.models.fishing_zone import FishingZone
from app.models.marine_protected_area import MarineProtectedArea


def _box(min_lat: float, min_lon: float, max_lat: float, max_lon: float) -> str:
    return json.dumps({
        "type": "Polygon",
        "coordinates": [[
            [min_lon, min_lat], [max_lon, min_lat], [max_lon, max_lat], [min_lon, max_lat], [min_lon, min_lat],
        ]],
    })


SEED_PROTECTED_AREAS = [
    {
        "name": "Sentinel Reef Marine Protected Area",
        "geometry_geojson": _box(13.4, 71.4, 13.6, 71.6),
        "protection_level": "NO_TAKE",
        "authority": "Demo Marine Authority",
        "rules": "No fishing, anchoring or extraction. Transit permitted.",
    },
]

SEED_FISHING_ZONES = [
    {
        "name": "Silent Bank Seasonal Closure",
        "geometry_geojson": _box(12.18, 72.18, 12.35, 72.35),
        "zone_type": "NO_FISHING",
        "jurisdiction": "Demo Marine Authority",
    },
    {
        "name": "Restless Shoal Restricted Ground",
        "geometry_geojson": _box(12.08, 71.05, 12.2, 71.2),
        "zone_type": "RESTRICTED_FISHING",
        "jurisdiction": "Demo Marine Authority",
        "allowed_vessel_types": "FISHING",
    },
    {
        "name": "Coastal Fishing Ground",
        "geometry_geojson": _box(13.9, 71.9, 14.1, 72.1),
        "zone_type": "AUTHORIZED_FISHING",
        "jurisdiction": "Demo Marine Authority",
        "allowed_vessel_types": "FISHING",
    },
]


def seed_surveillance_zones(db: Session) -> None:
    if db.query(MarineProtectedArea).count() == 0:
        db.add_all(MarineProtectedArea(**data) for data in SEED_PROTECTED_AREAS)
    if db.query(FishingZone).count() == 0:
        db.add_all(FishingZone(**data) for data in SEED_FISHING_ZONES)
    db.commit()
