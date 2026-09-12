from typing import List, Dict, Any
from app.schemas.route import RouteExplanation


def generate_explanation(
    recommended: Dict[str, Any],
    baseline: Dict[str, Any],
    weights_mode: str
) -> RouteExplanation:
    """
    Generates explainable AI recommendation breakdown comparing the
    selected route against the baseline (typically fastest / direct route).
    """
    reasons: List[str] = []
    tradeoffs: List[str] = []

    fuel_diff = baseline["fuel_liters"] - recommended["fuel_liters"]
    co2_diff = baseline["co2_kg"] - recommended["co2_kg"]
    time_diff = recommended["time_hours"] - baseline["time_hours"]

    fuel_pct = (fuel_diff / baseline["fuel_liters"] * 100.0) if baseline["fuel_liters"] > 0 else 0.0
    co2_pct = (co2_diff / baseline["co2_kg"] * 100.0) if baseline["co2_kg"] > 0 else 0.0

    if fuel_diff > 1.0:
        reasons.append(f"{fuel_pct:.1f}% lower estimated fuel consumption ({fuel_diff:,.0f} L saved)")
    elif fuel_diff < -1.0:
        tradeoffs.append(f"{abs(fuel_pct):.1f}% higher fuel consumption ({abs(fuel_diff):,.0f} L extra)")
    else:
        reasons.append("Comparable fuel consumption to direct corridor")

    if co2_diff > 1.0:
        reasons.append(f"{co2_pct:.1f}% lower estimated CO2 emissions ({co2_diff:,.0f} kg avoided)")

    if recommended.get("risk_score", 0) <= baseline.get("risk_score", 0):
        reasons.append("Maintains optimal safe navigational clearance and avoids sensitive marine reserves")
    else:
        tradeoffs.append("Elevated risk index due to narrower navigational passage")

    if time_diff > 0.1:
        tradeoffs.append(f"+{time_diff:.1f} hours travel time compared with fastest route")
    elif time_diff < -0.1:
        reasons.append(f"{abs(time_diff):.1f} hours faster than alternative candidate routes")
    else:
        reasons.append("Equal travel duration to direct route")

    if not reasons:
        reasons.append("Optimal balance across speed, fuel efficiency, and maritime safety")

    return RouteExplanation(
        recommendation=recommended["name"],
        reasons=reasons,
        tradeoffs=tradeoffs,
        baseline_mode="fastest",
        savings_percentage_fuel=round(max(0.0, fuel_pct), 1),
        savings_percentage_co2=round(max(0.0, co2_pct), 1)
    )
