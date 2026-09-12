from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.debris import Debris
from app.models.cleanup_unit import CleanupUnit
from app.models.mission import Mission
from app.schemas.debris import DebrisResponse, DebrisDriftForecastResponse
from app.schemas.cleanup_unit import CleanupUnitResponse
from app.schemas.mission import MissionResponse, MissionPlanResponse


def test_phase4_models_and_schemas():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # 1. Create extended Debris
    debris = Debris(
        latitude=10.5,
        longitude=72.3,
        debris_type="ghost_net",
        estimated_size_m2=450.0,
        estimated_mass_kg=1200.0,
        estimated_volume_m3=3.5,
        density_category="critical",
        severity=85.0,
        clean_up_priority="urgent",
        status="detected",
        confidence=0.95,
        drift_heading_deg=82.5,
        drift_speed_knots=1.4,
        target_species_threatened="Olive Ridley Sea Turtles & Coral Reef",
        environmental_risk_score=88.5,
        nearest_mpa_distance_nm=14.2
    )
    db.add(debris)
    db.commit()
    db.refresh(debris)

    assert debris.id is not None
    debris_resp = DebrisResponse.model_validate(debris)
    assert debris_resp.debris_type == "ghost_net"
    assert debris_resp.drift_speed_knots == 1.4
    assert debris_resp.estimated_mass_kg == 1200.0

    # 2. Create CleanupUnit
    unit = CleanupUnit(
        unit_name="SeaSweeper-Alpha",
        unit_type="asv_skimmer",
        latitude=10.2,
        longitude=72.0,
        heading_deg=45.0,
        speed_knots=9.5,
        battery_pct=98.0,
        max_range_nm=150.0,
        capacity_kg=2000.0,
        current_load_kg=150.0,
        status="transit"
    )
    db.add(unit)
    db.commit()
    db.refresh(unit)

    assert unit.id is not None
    unit_resp = CleanupUnitResponse.model_validate(unit)
    assert unit_resp.unit_name == "SeaSweeper-Alpha"
    assert unit_resp.capacity_kg == 2000.0

    # 3. Create Mission
    mission = Mission(
        mission_name="Operation Coral Shield - Ghost Net Extraction",
        mission_type="debris_cleanup",
        status="active",
        priority="urgent",
        target_lat=10.5,
        target_lon=72.3,
        origin_lat=10.2,
        origin_lon=72.0,
        waypoints_json='[{"lat": 10.2, "lon": 72.0, "action": "transit"}, {"lat": 10.5, "lon": 72.3, "action": "collect"}]',
        target_debris_ids=str(debris.id),
        estimated_duration_hours=5.5,
        estimated_energy_kwh=32.0,
        collected_kg=0.0,
        target_kg=1200.0,
        approval_status="approved"
    )
    db.add(mission)
    db.commit()
    db.refresh(mission)

    # Link unit to mission
    unit.assigned_mission_id = mission.id
    db.commit()
    db.refresh(unit)
    db.refresh(mission)

    assert len(mission.cleanup_units) == 1
    assert mission.cleanup_units[0].unit_name == "SeaSweeper-Alpha"

    mission_resp = MissionResponse.model_validate(mission)
    assert mission_resp.mission_name == "Operation Coral Shield - Ghost Net Extraction"
    assert mission_resp.approval_status == "approved"
    db.close()
