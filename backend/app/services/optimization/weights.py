from typing import Dict
from app.schemas.route import OptimizationWeights

MODE_PRESETS: Dict[str, OptimizationWeights] = {
    "fastest": OptimizationWeights(time=0.60, fuel=0.15, safety=0.15, environment=0.10, cost=0.0),
    "fuel_efficient": OptimizationWeights(fuel=0.55, time=0.15, safety=0.15, environment=0.15, cost=0.0),
    "green": OptimizationWeights(environment=0.45, fuel=0.30, safety=0.15, time=0.10, cost=0.0),
    "balanced": OptimizationWeights(fuel=0.25, time=0.25, safety=0.25, environment=0.25, cost=0.0),
}


def get_effective_weights(mode: str = "balanced", custom_weights: OptimizationWeights = None) -> OptimizationWeights:
    if custom_weights:
        return custom_weights.normalized()
    preset = MODE_PRESETS.get(mode.lower(), MODE_PRESETS["balanced"])
    return preset.normalized()
