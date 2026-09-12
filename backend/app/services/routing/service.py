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
        Generate multiple distinct candidate maritime paths:
        - 'direct': standard A* shortest path strictly over water
        - 'green': eco-corridor path avoiding sensitive coastal/marine sanctuary zones
        - 'alternative': alternate deep-water corridor
        """
        candidates = {}

        # 1. Direct path (shortest navigable over open water)
        direct_path = self.router.find_path(origin_lat, origin_lon, dest_lat, dest_lon)
        if not direct_path:
            direct_path = [(origin_lat, origin_lon), (dest_lat, dest_lon)]
        candidates["direct"] = direct_path

        # 2. Green route: penalize the Sri Lanka coastal cetacean sanctuary and Malacca choke
        green_penalty = [
            (5.0, 6.2, 79.5, 81.8),   # Sri Lanka sanctuary corridor
            (2.5, 3.5, 100.5, 101.5)  # Dense Malacca traffic sector
        ]
        green_path = self.router.find_path(origin_lat, origin_lon, dest_lat, dest_lon, penalty_zones=green_penalty)
        if green_path and green_path != direct_path:
            candidates["green"] = green_path
        else:
            # Generate oceanic detour strictly validating navigability
            detour = []
            for lat, lon in direct_path:
                cand_lat = round(lat - 0.5, 4) if 4.0 <= lat <= 12.0 else lat
                if self.router.grid.is_navigable(cand_lat, lon):
                    detour.append((cand_lat, lon))
                else:
                    detour.append((lat, lon))
            candidates["green"] = detour

        # 3. Alternative corridor: slight northern / deep water fairway
        alt_penalty = [
            (4.5, 7.5, 82.0, 92.0)    # Central Bay of Bengal / Indian Ocean fairway
        ]
        alt_path = self.router.find_path(origin_lat, origin_lon, dest_lat, dest_lon, penalty_zones=alt_penalty)
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
