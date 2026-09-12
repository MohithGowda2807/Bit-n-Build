import json
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.storm import Storm
from app.models.route import Route
from app.models.voyage import Voyage
from app.models.vessel import Vessel
from app.models.route_version import RouteVersion
from app.schemas.storm import StormCreate
from app.services.weather.service import weather_service
from app.services.storm.service import storm_service
from app.services.risk.engine import risk_engine
from app.services.routing.service import routing_service
from app.agents.commander import maritime_commander


client = TestClient(app, headers={"X-Role": "ADMIN", "X-User": "test.admin"})


def test_weather_service_sea_state_classification():
    assert weather_service.classify_sea_state(0.2) == 0  # Calm
    assert weather_service.classify_sea_state(0.8) == 1  # Slight
    assert weather_service.classify_sea_state(1.8) == 2  # Moderate
    assert weather_service.classify_sea_state(3.2) == 3  # Rough
    assert weather_service.classify_sea_state(5.0) == 4  # Very Rough
    assert weather_service.classify_sea_state(7.5) == 5  # Dangerous


def test_weather_service_sample_route():
    coords = [[72.85, 18.95], [75.0, 14.0], [80.0, 8.0]]
    report = weather_service.sample_route_weather(route_id=1, coordinates=coords)
    assert report.route_id == 1
    assert report.waypoints_count == 3
    assert len(report.waypoints) == 3
    assert report.max_wave_height_m > 0
    assert report.overall_environmental_risk >= 0


def test_storm_service_and_scenario_injection(db):
    # Test preset injection
    storms = storm_service.inject_preset_scenario(db, "bay_of_bengal_cyclone")
    assert len(storms) >= 1
    assert storms[0].is_active is True
    assert "Cyclone" in storms[0].name

    active = storm_service.get_active_storms(db)
    assert len(active) >= 1

    # Check proximity calculation
    closest, dist = storm_service.calculate_storm_proximity(13.0, 85.0, db)
    assert closest is not None
    assert dist < 200.0

    # Route intersection check
    route_coords = [[80.3, 13.1], [84.8, 12.8], [95.0, 6.0]]
    hazards = storm_service.check_route_storm_intersection(route_coords, db)
    assert len(hazards) > 0
    assert hazards[0]["intersects_outer_buffer"] is True

    # Clear storms
    storm_service.clear_all_storms(db)
    assert len(storm_service.get_active_storms(db)) == 0


def test_risk_engine_assessments(db):
    storm_service.clear_all_storms(db)

    # Calm baseline coordinate
    calm_score, factors = risk_engine.assess_coordinate_risk(10.0, 75.0, "container", db=db)
    assert calm_score < 40.0
    assert len(factors) >= 3

    # Inject severe storm
    storm_service.create_storm(db, StormCreate(
        name="Test Hurricane",
        storm_type="cyclone",
        severity="critical",
        center_latitude=15.0,
        center_longitude=70.0,
        radius_km=200.0,
        wind_speed_knots=70.0
    ))

    # Point near storm eye
    eye_score, eye_factors = risk_engine.assess_coordinate_risk(15.1, 70.1, "container", db=db)
    assert eye_score >= 60.0
    assert any(f.category == "STORM" for f in eye_factors)

    storm_service.clear_all_storms(db)


def test_dynamic_recalculation_and_lineage(db):
    # Setup test vessel, route, and voyage
    vessel = Vessel(
        vessel_identifier="VSL-TEST-999",
        name="MV Test Explorer",
        mmsi="999888777",
        vessel_type="container",
        cargo_capacity_tonnes=10000.0,
        fuel_consumption_rate=140.0,
        cruise_speed_knots=14.0,
        max_speed_knots=18.0,
        status="active"
    )
    db.add(vessel)
    db.commit()
    db.refresh(vessel)

    # Direct straight line across Bay of Bengal
    init_coords = [[80.3, 13.1], [85.0, 11.0], [95.0, 6.0], [103.8, 1.3]]
    route = Route(
        name="Initial Route v1",
        origin_lat=13.1,
        origin_lon=80.3,
        destination_lat=1.3,
        destination_lon=103.8,
        distance_km=2600.0,
        estimated_time_hours=100.0,
        estimated_fuel_liters=60000.0,
        estimated_co2_kg=180000.0,
        estimated_cost=45000.0,
        risk_score=20.0,
        geometry_geojson=json.dumps(init_coords)
    )
    db.add(route)
    db.commit()
    db.refresh(route)

    voyage = Voyage(
        vessel_id=vessel.id,
        route_id=route.id,
        status="active",
        starting_fuel=70000.0,
        estimated_fuel=60000.0
    )
    db.add(voyage)
    db.commit()
    db.refresh(voyage)

    # Inject storm right on the path
    storm = storm_service.create_storm(db, StormCreate(
        name="Direct Cyclone Block",
        storm_type="cyclone",
        severity="critical",
        center_latitude=11.0,
        center_longitude=85.0,
        radius_km=250.0,
        wind_speed_knots=70.0
    ))

    # Recalculate route
    result = routing_service.recalculate_voyage_route(
        voyage_id=voyage.id,
        reason="TEST_STORM_AVOIDANCE",
        mode="autonomous",
        db=db,
        candidate_profile="safest"
    )

    assert result["applied"] is True
    assert result["version_number"] >= 2
    assert result["new_route_id"] != route.id
    assert len(result["reasons"]) > 0

    # Verify RouteVersion in DB
    versions = db.query(RouteVersion).filter(RouteVersion.voyage_id == voyage.id).all()
    assert len(versions) >= 1
    assert versions[0].status == "active"

    # Verify Voyage updated
    db.refresh(voyage)
    assert voyage.route_id == result["new_route_id"]

    storm_service.clear_all_storms(db)


def test_simulation_scenario_api_endpoints():
    # 1. Inject preset storm via API
    resp = client.post("/api/v1/simulation/scenarios/inject-storm", json={
        "scenario_preset": "bay_of_bengal_cyclone"
    })
    assert resp.status_code == 200
    storms = resp.json()
    assert len(storms) >= 1
    assert "Cyclone" in storms[0]["name"]

    # 2. Get active storms
    active_resp = client.get("/api/v1/storms/active")
    assert active_resp.status_code == 200
    assert len(active_resp.json()) >= 1

    # 3. Mode endpoint
    mode_resp = client.post("/api/v1/simulation/mode", json={"mode": "autonomous"})
    assert mode_resp.status_code == 200
    assert mode_resp.json()["mode"] == "autonomous"

    get_mode = client.get("/api/v1/simulation/mode")
    assert get_mode.status_code == 200
    assert get_mode.json()["mode"] == "autonomous"

    # 4. Trigger commander cycle
    cycle_resp = client.post("/api/v1/simulation/cycle")
    assert cycle_resp.status_code == 200
    data = cycle_resp.json()
    assert data["status"] == "success"
    assert "environmental_routing" in data

    # 5. Reset environment
    reset_resp = client.post("/api/v1/simulation/scenarios/reset-environment")
    assert reset_resp.status_code == 200
    assert reset_resp.json()["storms_cleared"] >= 1
