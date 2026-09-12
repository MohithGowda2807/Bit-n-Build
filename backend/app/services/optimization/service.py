import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from app.models.vessel import Vessel
from app.models.route import Route, RouteSegment
from app.schemas.route import (
    RouteOptimizeRequest,
    RouteOptimizeResponse,
    RouteDetail,
    RouteComparisonItem,
    GeoJSONGeometry,
    RouteSegmentResponse
)
from app.services.routing.service import RoutingService
from app.services.routing.geometry import haversine_distance
from app.services.fuel.service import FuelService
from app.services.emissions.service import EmissionService
from app.services.eta.service import ETAService
from app.services.optimization.weights import get_effective_weights
from app.services.optimization.scoring import calculate_candidate_scores
from app.services.optimization.explanation import generate_explanation


class OptimizationService:
    """
    Maritime Commander / Shipping Agent Orchestration Service.
    Coordinates routing engine, hydrodynamic physics, emissions, and multi-objective ranking.
    """
    def __init__(self):
        self.routing_service = RoutingService()
        self.fuel_service = FuelService()
        self.emission_service = EmissionService()
        self.eta_service = ETAService()

    def optimize(self, request: RouteOptimizeRequest, db: Optional[Session] = None) -> RouteOptimizeResponse:
        vessel = None
        if db:
            vessel = db.query(Vessel).filter(Vessel.id == request.vessel_id).first()

        # Default vessel parameters if db not connected or vessel not found
        cruise_speed = vessel.cruise_speed_knots if vessel else 14.0
        max_speed = vessel.max_speed_knots if vessel else 18.0
        base_consumption = vessel.fuel_consumption_rate if vessel else 150.0
        cargo_weight = request.cargo_weight_tonnes or (vessel.cargo_capacity_tonnes * 0.7 if vessel else 5000.0)
        departure_time = request.departure_time or datetime.now(timezone.utc)

        from app.services.storm.service import storm_service
        from app.services.risk.engine import risk_engine

        # 1. Fetch active storms from DB
        active_storms = storm_service.get_active_storms(db) if db else []

        # 2. Generate path corridors from routing engine respecting active storm buffers
        paths = self.routing_service.generate_candidate_paths(
            origin_lat=request.origin.latitude,
            origin_lon=request.origin.longitude,
            dest_lat=request.destination.latitude,
            dest_lon=request.destination.longitude,
            storms=active_storms
        )

        candidates_raw = []

        # Candidate 1: Direct / Fastest
        direct_coords = paths.get("direct", [])
        dist_direct = self.routing_service.calculate_total_distance(direct_coords)
        speed_fast = min(max_speed, cruise_speed * 1.15)
        time_fast = self.eta_service.compute_travel_time_hours(dist_direct, speed_fast)
        fuel_fast = self.fuel_service.compute_fuel(base_consumption, speed_fast, cargo_weight, time_fast)
        co2_fast = self.emission_service.compute_co2(fuel_fast)
        cost_fast = self.fuel_service.compute_cost(fuel_fast)

        candidates_raw.append({
            "key": "fastest",
            "name": "Fastest Route",
            "mode": "fastest",
            "coords": direct_coords,
            "distance_km": dist_direct,
            "speed_knots": speed_fast,
            "time_hours": time_fast,
            "fuel_liters": fuel_fast,
            "co2_kg": co2_fast,
            "cost": cost_fast,
            "risk_score": 35.0,
            "environmental_impact": 70.0,
        })

        # Candidate 2: Fuel Efficient (Eco-cruising speed ~88% of cruise speed on direct or optimal corridor)
        speed_eco = max(8.0, cruise_speed * 0.88)
        time_eco = self.eta_service.compute_travel_time_hours(dist_direct, speed_eco)
        fuel_eco = self.fuel_service.compute_fuel(base_consumption, speed_eco, cargo_weight, time_eco)
        co2_eco = self.emission_service.compute_co2(fuel_eco)
        cost_eco = self.fuel_service.compute_cost(fuel_eco)

        candidates_raw.append({
            "key": "fuel_efficient",
            "name": "Fuel-Efficient Route",
            "mode": "fuel_efficient",
            "coords": direct_coords,
            "distance_km": dist_direct,
            "speed_knots": speed_eco,
            "time_hours": time_eco,
            "fuel_liters": fuel_eco,
            "co2_kg": co2_eco,
            "cost": cost_eco,
            "risk_score": 25.0,
            "environmental_impact": 40.0,
        })

        # Candidate 3: Green / Protected Corridor
        green_coords = paths.get("green", direct_coords)
        dist_green = self.routing_service.calculate_total_distance(green_coords)
        speed_green = max(8.0, cruise_speed * 0.85)
        time_green = self.eta_service.compute_travel_time_hours(dist_green, speed_green)
        fuel_green = self.fuel_service.compute_fuel(base_consumption, speed_green, cargo_weight, time_green)
        co2_green = self.emission_service.compute_co2(fuel_green)
        cost_green = self.fuel_service.compute_cost(fuel_green)

        candidates_raw.append({
            "key": "green",
            "name": "Green Eco-Corridor",
            "mode": "green",
            "coords": green_coords,
            "distance_km": dist_green,
            "speed_knots": speed_green,
            "time_hours": time_green,
            "fuel_liters": fuel_green,
            "co2_kg": co2_green,
            "cost": cost_green,
            "risk_score": 10.0,
            "environmental_impact": 20.0,
        })

        # Candidate 4: Balanced Route
        alt_coords = paths.get("alternative", direct_coords)
        dist_alt = self.routing_service.calculate_total_distance(alt_coords)
        speed_bal = cruise_speed
        time_bal = self.eta_service.compute_travel_time_hours(dist_alt, speed_bal)
        fuel_bal = self.fuel_service.compute_fuel(base_consumption, speed_bal, cargo_weight, time_bal)
        co2_bal = self.emission_service.compute_co2(fuel_bal)
        cost_bal = self.fuel_service.compute_cost(fuel_bal)

        candidates_raw.append({
            "key": "balanced",
            "name": "Balanced Route",
            "mode": "balanced",
            "coords": alt_coords,
            "distance_km": dist_alt,
            "speed_knots": speed_bal,
            "time_hours": time_bal,
            "fuel_liters": fuel_bal,
            "co2_kg": co2_bal,
            "cost": cost_bal,
            "risk_score": 20.0,
            "environmental_impact": 45.0,
        })

        # 2. Get normalized weights
        weights = get_effective_weights(request.mode or "balanced", request.optimization)

        # 3. Calculate multi-objective scores
        scored = calculate_candidate_scores(candidates_raw, weights)

        # Highest scored candidate is recommended
        best = scored[0]
        baseline = next((c for c in scored if c["mode"] == "fastest"), scored[-1])

        # 4. Generate structured explanation
        explanation = generate_explanation(best, baseline, request.mode or "balanced")

        # 5. Build comparison list
        comparison: List[RouteComparisonItem] = []
        for c in scored:
            comparison.append(RouteComparisonItem(
                name=c["name"],
                mode=c["mode"],
                distance_km=c["distance_km"],
                fuel_liters=c["fuel_liters"],
                time_hours=c["time_hours"],
                co2_kg=c["co2_kg"],
                cost=c["cost"],
                risk_score=c["risk_score"],
                optimization_score=c["optimization_score"],
                is_recommended=(c["name"] == best["name"])
            ))

        def to_detail(c: Dict[str, Any]) -> RouteDetail:
            # GeoJSON coordinates are [lon, lat]
            geojson_coords = [[round(p[1], 4), round(p[0], 4)] for p in c["coords"]]
            eta_dt = self.eta_service.compute_eta(departure_time, c["time_hours"])
            fuel_saved = max(0.0, baseline["fuel_liters"] - c["fuel_liters"])
            co2_avoided = max(0.0, baseline["co2_kg"] - c["co2_kg"])

            segments: List[RouteSegmentResponse] = []
            for i in range(len(c["coords"]) - 1):
                p1 = c["coords"][i]
                p2 = c["coords"][i + 1]
                seg_dist = haversine_distance(p1[0], p1[1], p2[0], p2[1])
                seg_time = self.eta_service.compute_travel_time_hours(seg_dist, c["speed_knots"])
                seg_fuel = self.fuel_service.compute_fuel(base_consumption, c["speed_knots"], cargo_weight, seg_time)
                segments.append(RouteSegmentResponse(
                    sequence_number=i + 1,
                    start_lat=p1[0],
                    start_lon=p1[1],
                    end_lat=p2[0],
                    end_lon=p2[1],
                    distance_km=round(seg_dist, 2),
                    estimated_speed_knots=c["speed_knots"],
                    estimated_fuel_liters=round(seg_fuel, 2),
                    estimated_time_hours=round(seg_time, 2)
                ))

            return RouteDetail(
                name=c["name"],
                optimization_mode=c["mode"],
                distance_km=c["distance_km"],
                estimated_time_hours=c["time_hours"],
                estimated_fuel_liters=c["fuel_liters"],
                estimated_co2_kg=c["co2_kg"],
                estimated_cost=c["cost"],
                risk_score=c["risk_score"],
                environmental_score=round(100.0 - c["environmental_impact"], 1),
                optimization_score=c["optimization_score"],
                fuel_saved_liters=round(fuel_saved, 1),
                co2_avoided_kg=round(co2_avoided, 1),
                eta=eta_dt,
                geometry=GeoJSONGeometry(type="LineString", coordinates=geojson_coords),
                segments=segments
            )

        recommended_detail = to_detail(best)
        alternatives_detail = [to_detail(c) for c in scored if c["name"] != best["name"]]

        # Persist route to DB if session provided
        if db:
            db_route = Route(
                name=recommended_detail.name,
                origin_lat=request.origin.latitude,
                origin_lon=request.origin.longitude,
                destination_lat=request.destination.latitude,
                destination_lon=request.destination.longitude,
                distance_km=recommended_detail.distance_km,
                estimated_time_hours=recommended_detail.estimated_time_hours,
                estimated_fuel_liters=recommended_detail.estimated_fuel_liters,
                estimated_co2_kg=recommended_detail.estimated_co2_kg,
                estimated_cost=recommended_detail.estimated_cost,
                risk_score=recommended_detail.risk_score,
                environmental_score=recommended_detail.environmental_score,
                optimization_score=recommended_detail.optimization_score,
                optimization_mode=recommended_detail.optimization_mode,
                geometry_geojson=json.dumps(recommended_detail.geometry.model_dump())
            )
            db.add(db_route)
            db.commit()
            db.refresh(db_route)
            recommended_detail.id = db_route.id

        return RouteOptimizeResponse(
            recommended_route=recommended_detail,
            alternatives=alternatives_detail,
            comparison=comparison,
            explanation=explanation
        )
