from app.services.debris.fleet_simulator import (
    AutonomousUnitState,
    calculate_power_consumption_kw
)


def test_power_consumption():
    # Idle power
    idle_kw = calculate_power_consumption_kw(speed_knots=0.0, status="idle")
    assert idle_kw < 1.0

    # Cruising power (8 knots)
    cruise_kw = calculate_power_consumption_kw(speed_knots=8.0, status="transit")
    assert 5.0 <= cruise_kw <= 12.0

    # Collecting power (includes machinery)
    collect_kw = calculate_power_consumption_kw(speed_knots=1.0, status="collecting")
    assert collect_kw > 3.5


def test_unit_state_machine_transit_and_collect():
    waypoints = [
        {"latitude": 10.1, "longitude": 72.0, "action": "collect"},
        {"latitude": 10.0, "longitude": 72.0, "action": "dock"}
    ]
    unit = AutonomousUnitState(
        unit_id=1,
        unit_name="AquaDrone-1",
        unit_type="autonomous_drone",
        latitude=10.0,
        longitude=72.0,
        speed_knots=12.0,
        battery_pct=100.0,
        battery_capacity_kwh=40.0,
        capacity_kg=500.0,
        status="transit",
        waypoints=waypoints,
        home_port_coords=(10.0, 72.0)
    )

    # 1. Step toward waypoint 1 (approx 6 nm away)
    # At 12 knots, 0.5 hours = 6 nm, should reach waypoint 1
    state1 = unit.step(dt_hours=0.6)
    assert state1["status"] in ["collecting", "transit"]
    assert state1["battery_pct"] < 100.0

    # 2. Simulate collection
    unit.status = "collecting"
    state2 = unit.step(dt_hours=1.0)
    assert state2["current_load_kg"] > 0.0

    # 3. Simulate low battery threshold trigger
    unit.battery_pct = 12.0
    state3 = unit.step(dt_hours=0.1)
    assert state3["status"] == "returning"
