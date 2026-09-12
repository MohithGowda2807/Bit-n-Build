import json
import math
from typing import List, Dict, Any, Optional, Tuple
from app.services.debris.clustering import haversine_distance_km


def point_in_polygon(lon: float, lat: float, poly_coords: List[List[float]]) -> bool:
    """
    Ray-casting point-in-polygon algorithm.
    poly_coords: list of [lon, lat] coordinates representing polygon boundary.
    """
    inside = False
    n = len(poly_coords)
    if n < 3:
        return False

    p1x, p1y = poly_coords[0][0], poly_coords[0][1]
    for i in range(1, n + 1):
        p2x, p2y = poly_coords[i % n][0], poly_coords[i % n][1]
        if lat > min(p1y, p2y):
            if lat <= max(p1y, p2y):
                if lon <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or lon <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y

    return inside


def parse_geojson_polygons(geometry_str: str) -> List[List[List[float]]]:
    """
    Parses a GeoJSON Polygon or MultiPolygon string and returns a list of ring coordinate lists.
    Each ring is a list of [lon, lat].
    """
    try:
        data = json.loads(geometry_str)
        if data.get("type") == "Polygon":
            return [data.get("coordinates", [[]])[0]]
        elif data.get("type") == "MultiPolygon":
            return [poly[0] for poly in data.get("coordinates", []) if poly]
    except Exception:
        pass
    return []


def min_distance_to_polygon_nm(lat: float, lon: float, poly_coords: List[List[float]]) -> float:
    """
    Approximates minimum distance in nautical miles from point (lat, lon)
    to a polygon boundary.
    """
    if not poly_coords:
        return 999.0

    min_dist_km = float("inf")
    for pt in poly_coords:
        dist = haversine_distance_km(lat, lon, pt[1], pt[0])
        if dist < min_dist_km:
            min_dist_km = dist

    # 1 km = 0.539957 nautical miles
    return round(min_dist_km * 0.539957, 2)


def evaluate_debris_environmental_risk(
    debris_lat: float,
    debris_lon: float,
    debris_type: str,
    estimated_mass_kg: float,
    trajectory: List[Dict[str, Any]],
    mpas: List[Dict[str, Any]],
    shipping_zones: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Calculates 0-100 environmental risk score for a debris cluster and checks
    against Marine Protected Areas (MPAs) and active shipping channels.
    """
    # 1. Base ecological factor by debris type
    type_weights = {
        "ghost_net": 1.45,           # Severe entangling threat to megafauna & reefs
        "chemical_slick": 1.60,      # Toxic water contamination
        "container_hazard": 1.25,    # Massive navigation and physical collision hazard
        "plastic_patch": 1.10,       # Chronic microplastic ingestion
        "microplastic_cluster": 1.15
    }
    weight = type_weights.get(debris_type, 1.0)

    # 2. Scale with mass
    # Normal reference mass = 1000 kg -> 30 base points
    mass_factor = min(35.0, (estimated_mass_kg / 1000.0) * 15.0)
    base_score = 25.0 + mass_factor

    # 3. Check proximity to MPAs and trajectory penetration
    nearest_mpa_name = None
    min_mpa_distance_nm = 999.0
    currently_in_mpa = False
    crosses_mpa = False
    entry_hour = None
    threatened_mpa = None

    for mpa in mpas:
        geo_str = mpa.get("geometry_geojson", "")
        rings = parse_geojson_polygons(geo_str)
        mpa_name = mpa.get("name", "Marine Reserve")

        for ring in rings:
            # Check current position
            if point_in_polygon(debris_lon, debris_lat, ring):
                currently_in_mpa = True
                nearest_mpa_name = mpa_name
                min_mpa_distance_nm = 0.0
                break

            # Calculate distance
            dist_nm = min_distance_to_polygon_nm(debris_lat, debris_lon, ring)
            if dist_nm < min_mpa_distance_nm:
                min_mpa_distance_nm = dist_nm
                nearest_mpa_name = mpa_name

            # Check future drift trajectory
            if not crosses_mpa:
                for wp in trajectory:
                    if point_in_polygon(wp["longitude"], wp["latitude"], ring):
                        crosses_mpa = True
                        entry_hour = wp["hour"]
                        threatened_mpa = mpa_name
                        wp["mpa_collision_risk"] = True
                        wp["nearest_zone"] = mpa_name
                        break

    # 4. Proximity penalties
    mpa_penalty = 0.0
    if currently_in_mpa:
        mpa_penalty = 50.0
    elif crosses_mpa:
        # Imminent collision with MPA
        hours_to_impact = entry_hour or 24
        urgency_multiplier = max(1.0, 2.0 - (hours_to_impact / 24.0))
        mpa_penalty = 35.0 * urgency_multiplier
    elif min_mpa_distance_nm < 20.0:
        mpa_penalty = 25.0
    elif min_mpa_distance_nm < 50.0:
        mpa_penalty = 12.0

    # 5. Shipping lane hazard
    shipping_hazard = False
    shipping_penalty = 0.0
    if shipping_zones:
        for zone in shipping_zones:
            geo_str = zone.get("geometry_geojson", "")
            rings = parse_geojson_polygons(geo_str)
            for ring in rings:
                if point_in_polygon(debris_lon, debris_lat, ring):
                    shipping_hazard = True
                    shipping_penalty = 20.0
                    break

    # Calculate final composite score
    total_score = min(100.0, (base_score * weight) + mpa_penalty + shipping_penalty)
    total_score = round(max(5.0, total_score), 1)

    # Clean narrative summary
    if currently_in_mpa:
        narrative = f"CRITICAL: {debris_type.replace('_', ' ').capitalize()} is currently INSIDE protected sanctuary '{nearest_mpa_name}'. Immediate autonomous intervention required."
        priority = "urgent"
    elif crosses_mpa:
        narrative = f"URGENT: {debris_type.replace('_', ' ').capitalize()} projected to enter '{threatened_mpa}' in ~{entry_hour} hours at present drift velocity. Autonomous fleet dispatch recommended."
        priority = "urgent"
    elif min_mpa_distance_nm < 30.0:
        narrative = f"ELEVATED: Located {min_mpa_distance_nm:.1f} nm from '{nearest_mpa_name}'. Drifting along boundary."
        priority = "high"
    elif shipping_hazard:
        narrative = f"HAZARD: Active obstacle located inside high-density commercial shipping channel."
        priority = "high"
    else:
        narrative = f"MODERATE: Open water {debris_type.replace('_', ' ')} with stable ocean drift."
        priority = "medium" if total_score > 40 else "low"

    return {
        "environmental_risk_score": total_score,
        "priority": priority,
        "nearest_mpa_name": nearest_mpa_name,
        "nearest_mpa_distance_nm": min_mpa_distance_nm,
        "currently_in_mpa": currently_in_mpa,
        "crosses_mpa": crosses_mpa,
        "hours_to_mpa_entry": entry_hour,
        "threatened_mpa": threatened_mpa,
        "shipping_hazard": shipping_hazard,
        "narrative": narrative
    }
