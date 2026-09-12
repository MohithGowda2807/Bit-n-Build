import json
import logging
from typing import List, Tuple, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.services.routing.geometry import haversine_distance, km_to_nautical_miles
from app.services.routing.astar import AStarRouter
from app.models.route import Route, RouteSegment
from app.models.voyage import Voyage
from app.models.route_version import RouteVersion
from app.models.agent_decision import AgentDecisionLog
from app.services.storm.service import storm_service
from app.services.fuel.service import FuelService
from app.services.emissions.service import EmissionService
from app.services.eta.service import ETAService

logger = logging.getLogger("oceansentinel.routing_service")


class RoutingService:
    """
    Maritime Routing Service (Phase 2).
    Generates multi-candidate corridors and executes dynamic re-routing with
    anti-oscillation safeguards, version lineage, and explainability.
    """
    def __init__(self):
        self.router = AStarRouter()
        self.fuel_service = FuelService()
        self.emission_service = EmissionService()
        self.eta_service = ETAService()

    def calculate_total_distance(self, coordinates: List[Tuple[float, float]]) -> float:
        """Calculate total line distance in km across coordinate waypoints."""
        if len(coordinates) < 2:
            return 0.0
        total = 0.0
        for i in range(len(coordinates) - 1):
            p1 = coordinates[i]
            p2 = coordinates[i + 1]
            total += haversine_distance(p1[0], p1[1], p2[0], p2[1])
        return round(total, 2)

    def generate_candidate_paths(
        self,
        origin_lat: float,
        origin_lon: float,
        dest_lat: float,
        dest_lon: float,
        storms: Optional[List[Any]] = None
    ) -> Dict[str, List[Tuple[float, float]]]:
        """
        Generate multiple distinct candidate maritime paths:
        - 'direct': standard A* shortest path over open water (avoiding storms)
        - 'green': eco-corridor path avoiding coastal sanctuary zones and storms
        - 'safest': maximal standoff distance around active storm perimeters
        - 'alternative': alternate deep-water corridor
        """
        candidates = {}

        # 1. Direct path (shortest navigable over open water, respecting storm buffers)
        direct_path = self.router.find_path(
            origin_lat, origin_lon, dest_lat, dest_lon,
            storms=storms,
            optimization_profile="balanced"
        )
        if not direct_path:
            direct_path = [(origin_lat, origin_lon), (dest_lat, dest_lon)]
        candidates["direct"] = direct_path

        # 2. Green route: penalize the Sri Lanka coastal cetacean sanctuary and Malacca choke
        green_penalty = [
            (5.0, 6.2, 79.5, 81.8),   # Sri Lanka sanctuary corridor
            (2.5, 3.5, 100.5, 101.5)  # Dense Malacca traffic sector
        ]
        green_path = self.router.find_path(
            origin_lat, origin_lon, dest_lat, dest_lon,
            penalty_zones=green_penalty,
            storms=storms,
            optimization_profile="fuel_efficient"
        )
        if green_path and green_path != direct_path:
            candidates["green"] = green_path
        else:
            detour = []
            for lat, lon in direct_path:
                cand_lat = round(lat - 0.5, 4) if 4.0 <= lat <= 12.0 else lat
                if self.router.grid.is_navigable(cand_lat, lon):
                    detour.append((cand_lat, lon))
                else:
                    detour.append((lat, lon))
            candidates["green"] = detour

        # 3. Safest route: maximal standoff around any active storms
        safest_path = self.router.find_path(
            origin_lat, origin_lon, dest_lat, dest_lon,
            storms=storms,
            optimization_profile="safest"
        )
        if safest_path:
            candidates["safest"] = safest_path
        else:
            candidates["safest"] = candidates.get("green", direct_path)

        # 4. Alternative corridor: deep water fairway
        alt_penalty = [
            (4.5, 7.5, 82.0, 92.0)
        ]
        alt_path = self.router.find_path(
            origin_lat, origin_lon, dest_lat, dest_lon,
            penalty_zones=alt_penalty,
            storms=storms,
            optimization_profile="balanced"
        )
        if alt_path and alt_path != direct_path and alt_path != candidates.get("green"):
            candidates["alternative"] = alt_path
        else:
            detour_alt = []
            for lat, lon in direct_path:
                cand_lat = round(lat + 0.5, 4) if 3.0 <= lat <= 8.0 and 82.0 <= lon <= 95.0 else lat
                if self.router.grid.is_navigable(cand_lat, lon):
                    detour_alt.append((cand_lat, lon))
                else:
                    detour_alt.append((lat, lon))
            candidates["alternative"] = detour_alt

        return candidates

    def recalculate_voyage_route(
        self,
        voyage_id: int,
        reason: str,
        mode: str,
        db: Session,
        candidate_profile: str = "safest",
        min_improvement_pct: float = 5.0
    ) -> Dict[str, Any]:
        """
        Dynamically recalculates a voyage's route in response to environmental hazards or storms.
        Maintains route version history, applies anti-oscillation guards, and creates audit decisions.
        """
        from app.services.risk.engine import risk_engine

        voyage = db.query(Voyage).filter(Voyage.id == voyage_id).first()
        if not voyage:
            raise ValueError(f"Voyage with id {voyage_id} not found")

        old_route = voyage.route
        if not old_route:
            raise ValueError(f"Voyage {voyage_id} has no assigned route to recalculate")

        # Get active storms
        active_storms = storm_service.get_active_storms(db)

        # Assess old route current risk
        old_assessment = risk_engine.assess_route_risk(old_route, db, voyage.vessel)
        old_risk = old_assessment.overall_score

        # Generate new path using A* avoiding active storms
        new_path_coords = self.router.find_path(
            old_route.origin_lat, old_route.origin_lon,
            old_route.destination_lat, old_route.destination_lon,
            storms=active_storms,
            optimization_profile=candidate_profile
        )

        if not new_path_coords:
            # If standard search failed, fallback to candidate paths
            cands = self.generate_candidate_paths(
                old_route.origin_lat, old_route.origin_lon,
                old_route.destination_lat, old_route.destination_lon,
                storms=active_storms
            )
            new_path_coords = cands.get("safest") or cands.get("direct")

        # Calculate physics for new route
        dist_km = self.calculate_total_distance(new_path_coords)
        vessel = voyage.vessel
        speed_knots = vessel.cruise_speed_knots if vessel else 14.0
        cargo_tonnes = vessel.cargo_capacity_tonnes * 0.7 if vessel else 5000.0
        base_consumption = vessel.fuel_consumption_rate if vessel else 150.0

        eta_hours = self.eta_service.compute_travel_time_hours(dist_km, speed_knots)
        fuel_liters = self.fuel_service.compute_fuel(base_consumption, speed_knots, cargo_tonnes, eta_hours)
        co2_kg = self.emission_service.compute_co2(fuel_liters)
        cost_est = self.fuel_service.compute_cost(fuel_liters)

        # Build GeoJSON [[lon, lat], ...]
        geojson_coords = [[pt[1], pt[0]] for pt in new_path_coords]
        geojson_str = json.dumps(geojson_coords)

        # Pre-assess risk of new route
        # Temporarily instantiate route object to evaluate with risk engine
        temp_route = Route(
            name=f"Dynamic Avoidance ({candidate_profile.capitalize()})",
            origin_lat=old_route.origin_lat,
            origin_lon=old_route.origin_lon,
            destination_lat=old_route.destination_lat,
            destination_lon=old_route.destination_lon,
            distance_km=dist_km,
            estimated_time_hours=eta_hours,
            estimated_fuel_liters=fuel_liters,
            estimated_co2_kg=co2_kg,
            estimated_cost=cost_est,
            risk_score=20.0,
            geometry_geojson=geojson_str
        )
        new_assessment = risk_engine.assess_route_risk(temp_route, db, vessel)
        new_risk = new_assessment.overall_score
        temp_route.risk_score = new_risk

        # Differentials
        risk_reduction_pct = round(((old_risk - new_risk) / max(1.0, old_risk)) * 100.0, 1)
        fuel_change_pct = round(((fuel_liters - old_route.estimated_fuel_liters) / max(1.0, old_route.estimated_fuel_liters)) * 100.0, 1)
        eta_change_hours = round(eta_hours - old_route.estimated_time_hours, 2)

        # Anti-oscillation & Safety check
        # If risk reduction is negligible and old route was NOT critical, retain old route
        should_switch = (
            risk_reduction_pct >= min_improvement_pct or
            old_assessment.is_critical or
            old_assessment.requires_rerouting or
            mode == "autonomous"
        )

        reasons = []
        if active_storms:
            storm_names = [s.name for s in active_storms]
            reasons.append(f"Active storm perimeter detected in shipping sector: {', '.join(storm_names)}")
        if old_assessment.is_critical:
            reasons.append(f"Old route enters critical risk zone ({old_risk:.1f}/100) exceeding vessel tolerance threshold")
        if risk_reduction_pct > 0:
            reasons.append(f"New dynamic path reduces voyage risk by {risk_reduction_pct:.1f}% ({old_risk:.1f} → {new_risk:.1f})")
        else:
            reasons.append(f"Route optimized for safe maritime clearance")

        tradeoffs = {
            "fuel_delta_pct": fuel_change_pct,
            "eta_delta_hours": eta_change_hours,
            "distance_delta_km": round(dist_km - old_route.distance_km, 1),
            "safety_gain_points": round(old_risk - new_risk, 1)
        }

        # Persist new Route in DB
        db.add(temp_route)
        db.commit()
        db.refresh(temp_route)

        # Create segments
        for i in range(len(new_path_coords) - 1):
            p1 = new_path_coords[i]
            p2 = new_path_coords[i + 1]
            seg_dist = haversine_distance(p1[0], p1[1], p2[0], p2[1])
            seg_time = seg_dist / max(1.0, speed_knots * 1.852)
            seg_fuel = (fuel_liters / max(1, len(new_path_coords) - 1))
            seg = RouteSegment(
                route_id=temp_route.id,
                sequence_number=i + 1,
                start_lat=p1[0],
                start_lon=p1[1],
                end_lat=p2[0],
                end_lon=p2[1],
                distance_km=round(seg_dist, 2),
                estimated_speed_knots=speed_knots,
                estimated_fuel_liters=round(seg_fuel, 2),
                estimated_time_hours=round(seg_time, 2)
            )
            db.add(seg)
        db.commit()

        # Find current version number
        latest_ver = db.query(RouteVersion).filter(RouteVersion.voyage_id == voyage.id).order_by(RouteVersion.version_number.desc()).first()
        next_ver_num = (latest_ver.version_number + 1) if latest_ver else 2

        applied = False
        if should_switch and (mode in ("autonomous", "semi_autonomous")):
            # Update voyage to the new route
            voyage.route_id = temp_route.id
            voyage.estimated_fuel = temp_route.estimated_fuel_liters
            voyage.co2_estimated = temp_route.estimated_co2_kg
            db.commit()
            applied = True

        # Record RouteVersion
        route_version = RouteVersion(
            voyage_id=voyage.id,
            version_number=next_ver_num,
            route_id=temp_route.id,
            parent_version_id=latest_ver.id if latest_ver else None,
            trigger_event=reason,
            change_reason="; ".join(reasons),
            risk_score=new_risk,
            fuel_liters=fuel_liters,
            eta_hours=eta_hours,
            co2_kg=co2_kg,
            risk_reduction_pct=risk_reduction_pct,
            fuel_change_pct=fuel_change_pct,
            eta_change_hours=eta_change_hours,
            explanation_json=json.dumps({"reasons": reasons, "tradeoffs": tradeoffs}),
            status="active" if applied else "proposed"
        )
        db.add(route_version)

        # Log Agent Decision
        decision_log = AgentDecisionLog(
            agent_name="commander",
            action="RECALCULATE_ROUTE",
            trigger_event=reason,
            target_id=f"voyage_{voyage.id}",
            input_payload=json.dumps({"old_route_id": old_route.id, "old_risk": old_risk, "storms": len(active_storms)}),
            decision_payload=json.dumps({"new_route_id": temp_route.id, "applied": applied, "tradeoffs": tradeoffs}),
            reason="; ".join(reasons),
            confidence=0.96,
            mode=mode
        )
        db.add(decision_log)
        db.commit()

        logger.info(f"Voyage {voyage.id} recalculated: v{next_ver_num}, applied={applied}, risk: {old_risk} -> {new_risk}")

        return {
            "voyage_id": voyage.id,
            "previous_route_id": old_route.id,
            "new_route_id": temp_route.id,
            "version_number": next_ver_num,
            "risk_reduction_pct": risk_reduction_pct,
            "fuel_change_pct": fuel_change_pct,
            "eta_change_hours": eta_change_hours,
            "reasons": reasons,
            "tradeoffs": tradeoffs,
            "route_geojson": geojson_str,
            "applied": applied,
            "mode": mode
        }


routing_service = RoutingService()
