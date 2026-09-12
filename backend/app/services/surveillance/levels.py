"""Shared 0-100 score bands (spec section 35)."""

LEVEL_BANDS = (
    (80, "CRITICAL"),
    (60, "HIGH"),
    (40, "ELEVATED"),
    (20, "MODERATE"),
)


def level_for(score: float) -> str:
    for floor, label in LEVEL_BANDS:
        if score > floor:
            return label
    return "LOW"


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))
