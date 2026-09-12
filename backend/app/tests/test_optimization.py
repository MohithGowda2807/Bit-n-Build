from app.schemas.route import OptimizationWeights
from app.services.optimization.scoring import calculate_candidate_scores


def test_optimization_mode_preferences():
    candidates = [
        {
            "name": "Fastest Route",
            "mode": "fastest",
            "fuel_liters": 100000.0,
            "time_hours": 30.0,
            "risk_score": 30.0,
            "environmental_impact": 80.0
        },
        {
            "name": "Fuel-Efficient Route",
            "mode": "fuel_efficient",
            "fuel_liters": 70000.0,
            "time_hours": 42.0,
            "risk_score": 25.0,
            "environmental_impact": 40.0
        },
        {
            "name": "Green Route",
            "mode": "green",
            "fuel_liters": 75000.0,
            "time_hours": 45.0,
            "risk_score": 10.0,
            "environmental_impact": 15.0
        }
    ]

    # Test 1: Time weight high -> Fastest Route ranks 1st
    weights_fastest = OptimizationWeights(time=0.7, fuel=0.1, safety=0.1, environment=0.1).normalized()
    scored_fast = calculate_candidate_scores(candidates, weights_fastest)
    assert scored_fast[0]["name"] == "Fastest Route"

    # Test 2: Fuel weight high -> Fuel-Efficient Route ranks 1st
    weights_fuel = OptimizationWeights(fuel=0.7, time=0.1, safety=0.1, environment=0.1).normalized()
    scored_fuel = calculate_candidate_scores(candidates, weights_fuel)
    assert scored_fuel[0]["name"] == "Fuel-Efficient Route"

    # Test 3: Environment weight high -> Green Route ranks 1st
    weights_green = OptimizationWeights(environment=0.7, fuel=0.1, safety=0.1, time=0.1).normalized()
    scored_green = calculate_candidate_scores(candidates, weights_green)
    assert scored_green[0]["name"] == "Green Route"
