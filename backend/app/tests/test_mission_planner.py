from app.services.debris.mission_planner import (
    plan_autonomous_cleanup_mission,
    optimize_waypoint_order_2opt,
    calculate_segment_distance_nm
)


def test_distance_calculation():
    # 1 degree of latitude is ~60 nm
    dist = calculate_segment_distance_nm(10.0, 72.0, 11.0, 72.0)
    assert abs(dist - 60.0) < 1.0


def test_plan_autonomous_cleanup_mission():
    unit = {
        "id": 1,
        "unit_name": "SeaSweeper-Alpha",
        "unit_type": "asv_skimmer",
        "latitude": 10.0,
        "longitude": 72.0,
        "speed_knots": 10.0,
        "capacity_kg": 1500.0,
        "current_load_kg": 0.0,
        "home_port_lat": 10.0,
        "home_port_lon": 72.0
    }

    debris_list = [
        {"id": 101, "latitude": 10.2, "longitude": 72.1, "estimated_mass_kg": 400.0, "severity": 85.0, "environmental_risk_score": 90.0, "debris_type": "ghost_net"},
        {"id": 102, "latitude": 10.4, "longitude": 72.3, "estimated_mass_kg": 500.0, "severity": 75.0, "environmental_risk_score": 80.0, "debris_type": "plastic_patch"},
        {"id": 103, "latitude": 10.8, "longitude": 72.6, "estimated_mass_kg": 900.0, "severity": 60.0, "environmental_risk_score": 65.0, "debris_type": "container_hazard"}
    ]

    # Available capacity is 1500 kg: should accept target 101 (400kg) + target 102 (500kg) = 900kg, but not target 103 (900kg would exceed 1500kg)
    plan = plan_autonomous_cleanup_mission(unit, debris_list, max_duration_hours=18.0)

    assert plan["assigned_unit_id"] == 1
    assert plan["target_debris_count"] == 2
    assert plan["estimated_yield_kg"] == 900.0
    assert plan["total_distance_nm"] > 0.0
    assert plan["estimated_duration_hours"] > 0.0
    assert plan["estimated_energy_kwh"] > 0.0
    assert plan["requires_human_approval"] is True
    assert len(plan["waypoints"]) == 4  # Start, 2 collections, Return dock
    assert plan["waypoints"][0]["action"] == "transit"
    assert plan["waypoints"][1]["action"] == "collect"
    assert plan["waypoints"][2]["action"] == "collect"
    assert plan["waypoints"][3]["action"] == "dock"
