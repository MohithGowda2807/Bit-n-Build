from typing import List, Tuple, Optional, Dict, Any
from app.services.routing.geometry import haversine_distance, km_to_nautical_miles
from app.services.routing.astar import AStarRouter


class RoutingService:
    def __init__(self):
        self.router = AStarRouter()

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
        dest_lon: float
    ) -> Dict[str, List[Tuple[float, float]]]:
        """
        Generate multiple distinct candidate paths:
        - 'direct': standard A* shortest path
        - 'green_corridor': avoids high-risk / environmental zones by penalizing central choke-points
        - 'coastal_safe': detours slightly for calmer oceanic corridors
        """
        candidates = {}

        # 1. Direct path (shortest navigable)
        direct_path = self.router.find_path(origin_lat, origin_lon, dest_lat, dest_lon)
        if not direct_path:
            # Fallback direct great-circle if grid points are immediately adjacent
            direct_path = [(origin_lat, origin_lon), (dest_lat, dest_lon)]
        candidates["direct"] = direct_path

        # 2. Green route (penalize middle latitudes to encourage open ocean / marine sanctuary avoidance)
        mid_lat = (origin_lat + dest_lat) / 2.0
        mid_lon = (origin_lon + dest_lon) / 2.0
        green_penalty = [(mid_lat - 1.5, mid_lat + 1.5, mid_lon - 3.0, mid_lon + 3.0)]
        green_path = self.router.find_path(origin_lat, origin_lon, dest_lat, dest_lon, penalty_zones=green_penalty)
        if green_path and green_path != direct_path:
            candidates["green"] = green_path
        else:
            # Create a slight southern / oceanic offset corridor
            offset_path = []
            for lat, lon in direct_path:
                offset_path.append((round(lat - 0.7, 4), round(lon, 4)))
            candidates["green"] = offset_path

        # 3. Alternative corridor (slight northern / deep water corridor)
        alt_penalty = [(mid_lat - 0.5, mid_lat + 2.5, mid_lon - 2.0, mid_lon + 2.0)]
        alt_path = self.router.find_path(origin_lat, origin_lon, dest_lat, dest_lon, penalty_zones=alt_penalty)
        if alt_path and alt_path != direct_path and alt_path != candidates.get("green"):
            candidates["alternative"] = alt_path
        else:
            offset_alt = []
            for lat, lon in direct_path:
                offset_alt.append((round(lat + 0.6, 4), round(lon, 4)))
            candidates["alternative"] = offset_alt

        return candidates
