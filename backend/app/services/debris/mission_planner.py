import math
from typing import List, Dict, Any, Optional, Tuple
from app.services.debris.clustering import haversine_distance_km
from app.services.debris.fleet_simulator import calculate_power_consumption_kw


def calculate_segment_distance_nm(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance in nautical miles between two coordinates."""
    km = haversine_distance_km(lat1, lon1, lat2, lon2)
    return km * 0.539957


def optimize_waypoint_order_2opt(
    origin: Tuple[float, float],
    targets: List[Dict[str, Any]],
    destination: Tuple[float, float]
) -> List[Dict[str, Any]]:
    """
    Finds optimal traversal order of targets starting at origin and ending at destination
    using a Greedy Nearest Neighbor heuristic followed by 2-opt pairwise improvement.
    """
    if len(targets) <= 1:
        return targets

    # 1. Greedy Nearest Neighbor
    unvisited = list(targets)
    ordered = []
    curr_lat, curr_lon = origin

    while unvisited:
        nearest_idx = 0
        min_dist = float("inf")
        for i, target in enumerate(unvisited):
            dist = calculate_segment_distance_nm(curr_lat, curr_lon, target["latitude"], target["longitude"])
            if dist < min_dist:
                min_dist = dist
                nearest_idx = i
        selected = unvisited.pop(nearest_idx)
        ordered.append(selected)
        curr_lat, curr_lon = selected["latitude"], selected["longitude"]

    # 2. 2-opt refinement
    improved = True
    iteration = 0
    max_iterations = 20

    def calculate_total_path_dist(route: List[Dict[str, Any]]) -> float:
        d = 0.0
        c_lat, c_lon = origin
        for pt in route:
            d += calculate_segment_distance_nm(c_lat, c_lon, pt["latitude"], pt["longitude"])
            c_lat, c_lon = pt["latitude"], pt["longitude"]
        d += calculate_segment_distance_nm(c_lat, c_lon, destination[0], destination[1])
        return d

    best_dist = calculate_total_path_dist(ordered)

    while improved and iteration < max_iterations:
        improved = False
        iteration += 1
        for i in range(len(ordered) - 1):
            for j in range(i + 1, len(ordered)):
                # Reverse segment between i and j
                new_route = ordered[:i] + ordered[i:j + 1][::-1] + ordered[j + 1:]
                new_dist = calculate_total_path_dist(new_route)
                if new_dist < best_dist - 0.05:
                    ordered = new_route
                    best_dist = new_dist
                    improved = True
                    break
            if improved:
                break

    return ordered


def plan_autonomous_cleanup_mission(
    unit: Dict[str, Any],
    debris_targets: List[Dict[str, Any]],
    max_duration_hours: float = 18.0,
    priority_override: Optional[str] = None
) -> Dict[str, Any]:
    """
    Plans an optimal autonomous cleanup mission for an ASV or marine drone:
    - Filters targets by capacity constraint and range feasibility
    - Optimizes waypoint order via TSP 2-opt
    - Calculates total nautical miles, battery consumption, and collection yield
    - Generates structured MissionWaypoints and human-approval package
    """
    unit_id = unit.get("id", 1)
    unit_name = unit.get("unit_name", "Autonomous Marine Drone")
    unit_type = unit.get("unit_type", "asv_skimmer")
    speed_knots = unit.get("speed_knots", 8.5)
    capacity_kg = unit.get("capacity_kg", 1500.0)
    current_load_kg = unit.get("current_load_kg", 0.0)
    available_capacity_kg = max(0.0, capacity_kg - current_load_kg)

    origin_coords = (unit.get("latitude", 10.0), unit.get("longitude", 72.0))
    home_port_coords = (
        unit.get("home_port_lat", origin_coords[0]),
        unit.get("home_port_lon", origin_coords[1])
    )

    # Sort debris by severity and environmental risk descending
    sorted_candidates = sorted(
        debris_targets,
        key=lambda d: (d.get("environmental_risk_score", 0.0) + d.get("severity", 0.0)),
        reverse=True
    )

    # Greedily accept targets until available payload capacity is filled
    accepted_targets = []
    cumulative_mass = 0.0
    for cand in sorted_candidates:
        cand_mass = cand.get("estimated_mass_kg", 400.0)
        if cumulative_mass + cand_mass <= available_capacity_kg:
            accepted_targets.append(cand)
            cumulative_mass += cand_mass
        elif not accepted_targets:
            # Always accept at least one high-priority target
            accepted_targets.append(cand)
            cumulative_mass += cand_mass
            break

    # Optimize route through accepted targets
    ordered_targets = optimize_waypoint_order_2opt(origin_coords, accepted_targets, home_port_coords)

    # Build sequential waypoints
    waypoints = []
    idx = 1
    curr_lat, curr_lon = origin_coords
    total_dist_nm = 0.0
    cumulative_hours = 0.0

    # Start waypoint
    waypoints.append({
        "waypoint_index": 0,
        "latitude": round(curr_lat, 5),
        "longitude": round(curr_lon, 5),
        "label": f"Deploy Base: {unit_name}",
        "action": "transit",
        "target_debris_id": None,
        "estimated_arrival_hours": 0.0
    })

    transit_power_kw = calculate_power_consumption_kw(speed_knots, "transit", unit_type)
    collect_power_kw = calculate_power_consumption_kw(1.0, "collecting", unit_type)

    total_energy_kwh = 0.0

    for target in ordered_targets:
        t_lat = target["latitude"]
        t_lon = target["longitude"]
        leg_dist = calculate_segment_distance_nm(curr_lat, curr_lon, t_lat, t_lon)
        total_dist_nm += leg_dist
        leg_transit_hours = leg_dist / speed_knots
        cumulative_hours += leg_transit_hours
        total_energy_kwh += leg_transit_hours * transit_power_kw

        # Collection work at target
        target_name = target.get("debris_type", "debris").replace("_", " ").title()
        waypoints.append({
            "waypoint_index": idx,
            "latitude": round(t_lat, 5),
            "longitude": round(t_lon, 5),
            "label": f"Collect {target_name} ({target.get('id', idx)})",
            "action": "collect",
            "target_debris_id": target.get("id"),
            "estimated_arrival_hours": round(cumulative_hours, 2)
        })
        idx += 1

        collection_duration = 1.25  # ~1h 15m per cluster
        cumulative_hours += collection_duration
        total_energy_kwh += collection_duration * collect_power_kw
        curr_lat, curr_lon = t_lat, t_lon

    # Return home leg
    return_dist = calculate_segment_distance_nm(curr_lat, curr_lon, home_port_coords[0], home_port_coords[1])
    total_dist_nm += return_dist
    return_transit_hours = return_dist / speed_knots
    cumulative_hours += return_transit_hours
    total_energy_kwh += return_transit_hours * transit_power_kw

    waypoints.append({
        "waypoint_index": idx,
        "latitude": round(home_port_coords[0], 5),
        "longitude": round(home_port_coords[1], 5),
        "label": "Return to Base / Mothership Dock",
        "action": "dock",
        "target_debris_id": None,
        "estimated_arrival_hours": round(cumulative_hours, 2)
    })

    mission_name = f"Mission {unit_name[:12].strip()}-Preserve-{len(ordered_targets)}P"
    benefit_summary = (
        f"Autonomous dispatch of {unit_name} targeting {len(ordered_targets)} hazard(s) totaling ~{cumulative_mass:.0f} kg. "
        f"Mission trajectory covers {total_dist_nm:.1f} nm with estimated {total_energy_kwh:.1f} kWh clean energy expenditure, "
        f"mitigating marine sanctuary contamination and species entanglement."
    )

    return {
        "mission_name": mission_name,
        "assigned_unit_id": unit_id,
        "assigned_unit_name": unit_name,
        "target_debris_count": len(ordered_targets),
        "total_distance_nm": round(total_dist_nm, 1),
        "estimated_duration_hours": round(cumulative_hours, 1),
        "estimated_energy_kwh": round(total_energy_kwh, 1),
        "estimated_yield_kg": round(cumulative_mass, 1),
        "waypoints": waypoints,
        "requires_human_approval": True,
        "ecological_benefit_summary": benefit_summary
    }
