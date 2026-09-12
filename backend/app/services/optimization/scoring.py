from typing import List, Dict, Any
from app.schemas.route import OptimizationWeights


def normalize_value(val: float, min_val: float, max_val: float) -> float:
    if abs(max_val - min_val) < 1e-6:
        return 0.5
    return (val - min_val) / (max_val - min_val)


def calculate_candidate_scores(
    candidates: List[Dict[str, Any]],
    weights: OptimizationWeights
) -> List[Dict[str, Any]]:
    """
    Normalizes candidate attributes across:
    - fuel
    - time
    - risk
    - emissions / environmental impact
    Calculates composite optimization score (0-100, where higher is better).
    """
    if not candidates:
        return []

    min_fuel = min(c["fuel_liters"] for c in candidates)
    max_fuel = max(c["fuel_liters"] for c in candidates)

    min_time = min(c["time_hours"] for c in candidates)
    max_time = max(c["time_hours"] for c in candidates)

    min_risk = min(c["risk_score"] for c in candidates)
    max_risk = max(c["risk_score"] for c in candidates)

    min_env = min(c["environmental_impact"] for c in candidates)
    max_env = max(c["environmental_impact"] for c in candidates)

    scored_candidates = []
    for c in candidates:
        norm_fuel = normalize_value(c["fuel_liters"], min_fuel, max_fuel)
        norm_time = normalize_value(c["time_hours"], min_time, max_time)
        norm_risk = normalize_value(c["risk_score"], min_risk, max_risk)
        norm_env = normalize_value(c["environmental_impact"], min_env, max_env)

        penalty = (
            weights.fuel * norm_fuel +
            weights.time * norm_time +
            weights.safety * norm_risk +
            weights.environment * norm_env
        )

        score = max(0.0, min(100.0, round((1.0 - penalty) * 100.0, 1)))
        item = dict(c)
        item["optimization_score"] = score
        scored_candidates.append(item)

    # Sort descending by score
    scored_candidates.sort(key=lambda x: x["optimization_score"], reverse=True)
    return scored_candidates
