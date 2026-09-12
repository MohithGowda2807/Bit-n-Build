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

    # 3. Debris Clusters
    existing_debris = db.query(Debris).count()
    if existing_debris < 5:
        debris_seeds = [
            Debris(
                latitude=10.42,
                longitude=72.15,
                debris_type="ghost_net",
                estimated_size_m2=650.0,
                estimated_mass_kg=1450.0,
                density_category="critical",
                severity=91.0,
                clean_up_priority="urgent",
                status="detected",
                confidence=0.96,
                drift_heading_deg=84.0,
                drift_speed_knots=1.6,
                target_species_threatened="Olive Ridley Sea Turtles & Brain Corals",
                environmental_risk_score=94.0,
                nearest_mpa_distance_nm=11.5,
                description="Massive abandoned monofilament gillnet drifting directly toward Lakshadweep Reef system."
            ),
            Debris(
                latitude=18.75,
                longitude=72.58,
                debris_type="chemical_slick",
                estimated_size_m2=1200.0,
                estimated_mass_kg=3200.0,
                density_category="critical",
                severity=88.0,
                clean_up_priority="urgent",
                status="detected",
                confidence=0.92,
                drift_heading_deg=165.0,
                drift_speed_knots=1.2,
                target_species_threatened="Coastal Fisheries & Mangrove Biome",
                environmental_risk_score=89.0,
                nearest_mpa_distance_nm=65.0,
                description="Heavy diesel and synthetic residue sheen trailing from recent dark-vessel rendezvous."
            ),
            Debris(
                latitude=15.28,
                longitude=73.35,
                debris_type="container_hazard",
                estimated_size_m2=35.0,
                estimated_mass_kg=8500.0,
                density_category="high",
                severity=82.0,
                clean_up_priority="high",
                status="detected",
                confidence=0.98,
                drift_heading_deg=310.0,
                drift_speed_knots=0.9,
                target_species_threatened="Navigation Collision Threat",
                environmental_risk_score=78.0,
                nearest_mpa_distance_nm=42.0,
                description="Semi-submerged 40ft shipping container adrift in active coastal shipping fairway."
            ),
            Debris(
                latitude=12.10,
                longitude=74.15,
                debris_type="plastic_patch",
                estimated_size_m2=1800.0,
                estimated_mass_kg=1200.0,
                density_category="medium",
                severity=68.0,
                clean_up_priority="medium",
                status="monitoring",
                confidence=0.88,
                drift_heading_deg=140.0,
                drift_speed_knots=1.1,
                target_species_threatened="Pelagic Seabirds & Manta Rays",
                environmental_risk_score=64.0,
                nearest_mpa_distance_nm=55.0,
                description="Accumulation of consumer plastics and polypropylene ropes trapped in localized eddy."
            ),
            Debris(
                latitude=8.20,
                longitude=76.85,
                debris_type="microplastic_cluster",
                estimated_size_m2=2400.0,
                estimated_mass_kg=750.0,
                density_category="medium",
                severity=58.0,
                clean_up_priority="medium",
                status="detected",
                confidence=0.85,
                drift_heading_deg=95.0,
                drift_speed_knots=1.3,
                target_species_threatened="Filter-feeding Whale Sharks",
                environmental_risk_score=55.0,
                nearest_mpa_distance_nm=35.0,
                description="Diffuse high-density microplastic filament cluster near Cape Comorin convergence."
            )
        ]
        db.add_all(debris_seeds)
        db.commit()

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
