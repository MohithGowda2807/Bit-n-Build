from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.vessel import Vessel
from app.models.debris import Debris
from app.models.cleanup_unit import CleanupUnit
from app.models.marine_zone import MarineZone
from app.models.marine_protected_area import MarineProtectedArea
from app.agents.triton_crew import triton_agents
from app.schemas.agent import OrchestratorRequest


def test_unified_orchestrator_multi_domain():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()

    # Seed minimal data
    vessel = Vessel(
        name="MV Ocean Trader",
        vessel_identifier="MMSI-987654321",
        vessel_type="cargo",
        latitude=10.0,
        longitude=72.0,
        speed_knots=12.0,
        heading=85.0,
        max_speed_knots=16.0,
        status="underway"
    )
    db.add(vessel)

    # Critical ghost net near Lakshadweep
    debris = Debris(
        latitude=10.2,
        longitude=72.1,
        debris_type="ghost_net",
        estimated_mass_kg=1200.0,
        estimated_size_m2=500.0,
        severity=88.0,
        clean_up_priority="urgent",
        status="detected",
        environmental_risk_score=90.0,
        drift_speed_knots=1.4,
        drift_heading_deg=80.0
    )
    db.add(debris)

    # Cleanup unit
    unit = CleanupUnit(
        unit_name="SeaSweeper-Alpha",
        unit_type="asv_skimmer",
        latitude=10.0,
        longitude=72.0,
        speed_knots=10.0,
        capacity_kg=2000.0,
        current_load_kg=0.0,
        battery_pct=95.0,
        status="idle"
    )
    db.add(unit)

    # MPA
    mpa = MarineProtectedArea(
        name="Lakshadweep Coral Reserve",
        geometry_geojson='{"type": "Polygon", "coordinates": [[[71.5, 9.5], [73.0, 9.5], [73.0, 11.5], [71.5, 11.5], [71.5, 9.5]]]}',
        protection_level="NO_TAKE"
    )
    db.add(mpa)
    db.commit()

    # Query orchestrator
    req = OrchestratorRequest(
        query="Scan operational corridor for debris collision hazards and MPA proximity threats",
        vessel_id=vessel.id
    )
    resp = triton_agents.orchestrate(req, db)

    assert resp.status == "success"
    assert len(resp.agent_findings) == 5  # Vessel Watch, Route Planner, Debris Sentinel, Cleanup Fleet, Compliance
    assert any(f.agent_name == "Autonomous Cleanup Agent" for f in resp.agent_findings)
    assert len(resp.agent_traces) >= 6
    assert len(resp.actions_proposed) > 0
    assert resp.actions_proposed[0]["action_type"] == "autonomous_mission_dispatch"
    assert resp.domain_impact["preservation_debris_target_kg"] > 0.0

    db.close()
