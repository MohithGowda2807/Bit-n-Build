from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel, Field, field_validator


class Coordinate(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)


class OptimizationWeights(BaseModel):
    fuel: float = Field(0.25, ge=0.0)
    time: float = Field(0.25, ge=0.0)
    safety: float = Field(0.25, ge=0.0)
    environment: float = Field(0.25, ge=0.0)
    cost: Optional[float] = Field(0.0, ge=0.0)

    def normalized(self) -> "OptimizationWeights":
        total = self.fuel + self.time + self.safety + self.environment + (self.cost or 0.0)
        if total <= 0:
            return OptimizationWeights(fuel=0.25, time=0.25, safety=0.25, environment=0.25, cost=0.0)
        return OptimizationWeights(
            fuel=self.fuel / total,
            time=self.time / total,
            safety=self.safety / total,
            environment=self.environment / total,
            cost=(self.cost or 0.0) / total,
        )


class RouteOptimizeRequest(BaseModel):
    vessel_id: int
    origin: Coordinate
    destination: Coordinate
    optimization: Optional[OptimizationWeights] = None
    mode: Optional[str] = "balanced"  # fastest, fuel_efficient, green, balanced, custom
    cargo_weight_tonnes: Optional[float] = None
    departure_time: Optional[datetime] = None
    record_version: bool = True  # False plans only: the live voyage and its lineage are left alone


class GeoJSONGeometry(BaseModel):
    type: str = "LineString"
    coordinates: List[List[float]]  # [[lon, lat], ...]


class RouteSegmentResponse(BaseModel):
    sequence_number: int
    start_lat: float
    start_lon: float
    end_lat: float
    end_lon: float
    distance_km: float
    estimated_speed_knots: float
    estimated_fuel_liters: float
    estimated_time_hours: float


class RouteDetail(BaseModel):
    id: Optional[int] = None
    name: str
    optimization_mode: str
    distance_km: float
    estimated_time_hours: float
    estimated_fuel_liters: float
    estimated_co2_kg: float
    estimated_cost: float
    risk_score: float
    environmental_score: float
    optimization_score: float
    fuel_saved_liters: float = 0.0
    co2_avoided_kg: float = 0.0
    eta: datetime
    geometry: GeoJSONGeometry
    segments: Optional[List[RouteSegmentResponse]] = None


class RouteExplanation(BaseModel):
    recommendation: str
    reasons: List[str]
    tradeoffs: List[str]
    baseline_mode: str = "fastest"
    savings_percentage_fuel: float = 0.0
    savings_percentage_co2: float = 0.0


class RouteComparisonItem(BaseModel):
    name: str
    mode: str
    distance_km: float
    fuel_liters: float
    time_hours: float
    co2_kg: float
    cost: float
    risk_score: float
    optimization_score: float
    is_recommended: bool = False


class RouteOptimizeResponse(BaseModel):
    recommended_route: RouteDetail
    alternatives: List[RouteDetail]
    comparison: List[RouteComparisonItem]
    explanation: RouteExplanation
