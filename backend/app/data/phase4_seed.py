import json
import logging
from sqlalchemy.orm import Session
from app.models.debris import Debris
from app.models.cleanup_unit import CleanupUnit
from app.models.mission import Mission
from app.models.marine_protected_area import MarineProtectedArea
from app.models.marine_zone import MarineZone

logger = logging.getLogger("oceansentinel.seed.phase4")


def seed_phase4_data(db: Session):
    """Seeds rich Arabian Sea and Indian Ocean debris clusters, autonomous fleet, and MPAs."""

    # 1. Marine Protected Areas if not present
    existing_mpas = db.query(MarineProtectedArea).count()
    if existing_mpas == 0:
        lakshadweep_poly = json.dumps({
            "type": "Polygon",
            "coordinates": [[[71.5, 9.5], [73.5, 9.5], [73.5, 11.8], [71.5, 11.8], [71.5, 9.5]]]
        })
        malvan_poly = json.dumps({
            "type": "Polygon",
            "coordinates": [[[73.3, 15.8], [73.7, 15.8], [73.7, 16.2], [73.3, 16.2], [73.3, 15.8]]]
        })
        gulf_mannar_poly = json.dumps({
            "type": "Polygon",
            "coordinates": [[[78.5, 8.6], [79.5, 8.6], [79.5, 9.4], [78.5, 9.4], [78.5, 8.6]]]
        })
        db.add_all([
            MarineProtectedArea(name="Lakshadweep Coral Reserve", geometry_geojson=lakshadweep_poly, protection_level="NO_TAKE"),
            MarineProtectedArea(name="Malvan Marine Sanctuary", geometry_geojson=malvan_poly, protection_level="RESTRICTED"),
            MarineProtectedArea(name="Gulf of Mannar Biosphere", geometry_geojson=gulf_mannar_poly, protection_level="NO_TAKE"),
        ])
        db.commit()

    # 2. Cleanup Fleet
    existing_units = db.query(CleanupUnit).count()
    if existing_units == 0:
        fleet = [
            CleanupUnit(
                unit_name="SeaSweeper-Alpha",
                unit_type="asv_skimmer",
                latitude=9.96,
                longitude=76.22,  # Kochi port
                heading_deg=280.0,
                speed_knots=9.5,
                battery_pct=96.0,
                max_range_nm=140.0,
                capacity_kg=2000.0,
                current_load_kg=250.0,
                status="idle"
            ),
            CleanupUnit(
                unit_name="AquaDrone-Eco1",
                unit_type="autonomous_drone",
                latitude=10.56,
                longitude=72.64,  # Kavaratti station
                heading_deg=90.0,
                speed_knots=13.5,
                battery_pct=100.0,
                max_range_nm=85.0,
                capacity_kg=600.0,
                current_load_kg=0.0,
                status="idle"
            ),
            CleanupUnit(
                unit_name="OceanClean-Titan",
                unit_type="asv_skimmer",
                latitude=18.94,
                longitude=72.85,  # Mumbai
                heading_deg=210.0,
                speed_knots=8.0,
                battery_pct=91.0,
                max_range_nm=180.0,
                capacity_kg=4500.0,
                current_load_kg=800.0,
                status="idle"
            ),
            CleanupUnit(
                unit_name="CoralGuard-Interceptor",
                unit_type="robotic_interceptor",
                latitude=15.42,
                longitude=73.80,  # Mormugao/Goa
                heading_deg=260.0,
                speed_knots=11.0,
                battery_pct=94.0,
                max_range_nm=110.0,
                capacity_kg=1200.0,
                current_load_kg=0.0,
                status="idle"
            )
        ]
        db.add_all(fleet)
        db.commit()

    # Debris comes from the Phase 1 seed (seed_data.SEED_DEBRIS), which runs first and carries masses and volumes.

    # 4. Create Flagship Active Mission
    existing_missions = db.query(Mission).count()
    if existing_missions == 0:
        first_unit = db.query(CleanupUnit).first()
        first_debris = db.query(Debris).filter(Debris.debris_type == "ghost_net").first()
        if first_unit and first_debris:
            mission = Mission(
                mission_name="Operation Coral Shield - Ghost Net Intercept",
                mission_type="debris_cleanup",
                status="active",
                priority="urgent",
                target_lat=first_debris.latitude,
                target_lon=first_debris.longitude,
                origin_lat=first_unit.latitude,
                origin_lon=first_unit.longitude,
                waypoints_json=json.dumps([
                    {"waypoint_index": 0, "latitude": first_unit.latitude, "longitude": first_unit.longitude, "label": "Kochi Base", "action": "transit"},
                    {"waypoint_index": 1, "latitude": first_debris.latitude, "longitude": first_debris.longitude, "label": "Intercept Ghost Net", "action": "collect"},
                    {"waypoint_index": 2, "latitude": 10.56, "longitude": 72.64, "label": "Kavaratti Dock", "action": "dock"}
                ]),
                target_debris_ids=str(first_debris.id),
                estimated_duration_hours=6.2,
                estimated_energy_kwh=38.5,
                collected_kg=350.0,
                target_kg=1450.0,
                approval_status="approved",
                assigned_unit_id=first_unit.id
            )
            db.add(mission)
            first_unit.assigned_mission_id = mission.id
            first_unit.status = "transit"
            db.commit()

    logger.info("Phase 4 seed dataset successfully initialized.")
