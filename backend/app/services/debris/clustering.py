import math
from typing import List, Dict, Any


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two points in kilometers."""
    R = 6371.0  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2.0) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2.0) ** 2
    )
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c


def cluster_debris_sightings(
    debris_list: List[Dict[str, Any]],
    eps_km: float = 35.0,
    min_samples: int = 1
) -> List[Dict[str, Any]]:
    """
    Groups individual debris detections into spatial clusters.
    Returns list of clusters with centroid coordinates, total estimated mass,
    aggregated area, and member IDs.
    """
    if not debris_list:
        return []

    visited = set()
    clusters = []
    cluster_counter = 1

    for i, d in enumerate(debris_list):
        if i in visited:
            continue

        # Start a new cluster
        cluster_members = [d]
        visited.add(i)

        for j, other in enumerate(debris_list):
            if j in visited:
                continue
            dist = haversine_distance_km(
                d["latitude"], d["longitude"],
                other["latitude"], other["longitude"]
            )
            if dist <= eps_km:
                visited.add(j)
                cluster_members.append(other)

        if len(cluster_members) >= min_samples:
            avg_lat = sum(m["latitude"] for m in cluster_members) / len(cluster_members)
            avg_lon = sum(m["longitude"] for m in cluster_members) / len(cluster_members)
            total_mass = sum(m.get("estimated_mass_kg", 500.0) for m in cluster_members)
            total_area = sum(m.get("estimated_size_m2", 100.0) for m in cluster_members)
            max_severity = max(m.get("severity", 50.0) for m in cluster_members)

            # Determine predominant debris type
            types = [m.get("debris_type", "plastic_patch") for m in cluster_members]
            predominant_type = max(set(types), key=types.count)

            clusters.append({
                "cluster_id": cluster_counter,
                "centroid_lat": round(avg_lat, 5),
                "centroid_lon": round(avg_lon, 5),
                "member_count": len(cluster_members),
                "member_ids": [m.get("id") for m in cluster_members if "id" in m],
                "predominant_type": predominant_type,
                "total_mass_kg": round(total_mass, 1),
                "total_area_m2": round(total_area, 1),
                "max_severity": round(max_severity, 1)
            })
            cluster_counter += 1

    return clusters
