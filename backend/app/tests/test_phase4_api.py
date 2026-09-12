import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.database import Base, get_db
from app.main import app
from app.models.debris import Debris
from app.models.cleanup_unit import CleanupUnit
from app.models.marine_protected_area import MarineProtectedArea
from app.models.mission import Mission

# Set up test database with shared in-memory pool
engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool)
Base.metadata.create_all(bind=engine)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


client = TestClient(app, headers={"X-Role": "ADMIN", "X-User": "test.admin"})


@pytest.fixture(autouse=True, scope="module")
def isolated_database():
    """Point the app at this module's in-memory database only while its tests run.

    Setting the override at import time would hijack every other module's requests,
    because pytest imports all test files before running any of them.
    """
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.pop(get_db, None)


def test_debris_drift_and_clusters_endpoints():
    db = TestingSessionLocal()
    debris = Debris(
        latitude=10.0,
        longitude=72.0,
        debris_type="ghost_net",
        severity=85.0,
        clean_up_priority="urgent",
        estimated_mass_kg=1200.0,
        drift_speed_knots=1.5,
        drift_heading_deg=85.0
    )
    db.add(debris)
    db.commit()
    db.refresh(debris)

    # 1. Test GET /api/v1/debris/{id}/drift
    res = client.get(f"/api/v1/debris/{debris.id}/drift?hours=12")
    assert res.status_code == 200
    data = res.json()
    assert data["debris_id"] == debris.id
    assert len(data["trajectory"]) == 13
    assert data["drift_speed_knots"] == 1.5

    # 2. Test GET /api/v1/debris/clusters
    res_clusters = client.get("/api/v1/debris/clusters")
    assert res_clusters.status_code == 200
    clusters = res_clusters.json()
    assert len(clusters) >= 1
    assert clusters[0]["member_count"] >= 1
    db.close()


def test_fleet_and_missions_endpoints():
    db = TestingSessionLocal()
    unit = CleanupUnit(
        unit_name="AquaDrone-X1",
        unit_type="autonomous_drone",
        latitude=10.0,
        longitude=72.0,
        battery_pct=95.0,
        status="idle"
    )
    db.add(unit)

    debris = Debris(
        latitude=10.2,
        longitude=72.1,
        debris_type="plastic_patch",
        severity=70.0,
        estimated_mass_kg=400.0
    )
    db.add(debris)
    db.commit()
    db.refresh(unit)
    db.refresh(debris)

    # 1. Test GET /api/v1/fleet/units
    res_fleet = client.get("/api/v1/fleet/units")
    assert res_fleet.status_code == 200
    units = res_fleet.json()
    assert any(u["unit_name"] == "AquaDrone-X1" for u in units)

    # 2. Test POST /api/v1/fleet/units/{id}/command
    res_cmd = client.post(f"/api/v1/fleet/units/{unit.id}/command", json={"command": "hold"})
    assert res_cmd.status_code == 200
    assert res_cmd.json()["operator_override"] == "hold"

    # 3. Test POST /api/v1/missions/plan
    res_plan = client.post("/api/v1/missions/plan", json={"debris_ids": [debris.id], "unit_id": unit.id})
    assert res_plan.status_code == 200
    plan = res_plan.json()
    assert plan["assigned_unit_id"] == unit.id
    assert len(plan["waypoints"]) >= 3

    # 4. Test GET /api/v1/analytics/impact
    res_impact = client.get("/api/v1/analytics/impact")
    assert res_impact.status_code == 200
    impact = res_impact.json()
    assert impact["co2_avoided_tonnes"] > 0
    assert impact["debris_cleared_kg"] > 0
    assert impact["fuel_saved_liters"] > 0

    # 5. Test Simulation Scenarios
    res_scenarios = client.get("/api/v1/simulation/demo-scenarios")
    assert res_scenarios.status_code == 200
    assert len(res_scenarios.json()) == 3

    res_load = client.post("/api/v1/simulation/load-scenario/ghost_net_mpa")
    assert res_load.status_code == 200
    assert res_load.json()["scenario_id"] == "ghost_net_mpa"
    db.close()

