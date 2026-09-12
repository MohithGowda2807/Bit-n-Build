import math
from typing import Tuple, List, Set, Optional
from app.services.routing.geometry import point_in_polygon

# Representative landmass polygons in [lon, lat] format to simulate realistic land avoidance
LANDMASS_POLYGONS = [
    # Indian Subcontinent Interior (South Asia landmass)
    [
        (69.0, 24.5), (72.5, 23.0), (73.5, 20.0), (74.5, 16.0), (76.0, 12.0),
        (77.5, 8.5), (78.2, 9.5), (79.8, 11.0), (80.5, 14.0), (82.5, 17.5),
        (85.5, 20.0), (88.0, 22.5), (89.5, 25.0), (80.0, 28.0), (70.0, 28.0)
    ],
    # Sri Lanka landmass
    [
        (79.7, 9.7), (80.5, 9.8), (81.8, 8.6), (81.7, 6.9), (80.5, 5.9),
        (79.8, 6.5), (79.6, 8.2)
    ],
    # Arabian Peninsula landmass
    [
        (43.0, 13.0), (51.0, 12.0), (55.5, 17.0), (59.8, 22.5), (58.5, 24.5),
        (56.0, 26.0), (53.0, 24.0), (49.0, 26.0), (45.0, 29.0), (37.0, 28.0),
        (40.0, 21.0), (42.5, 16.0)
    ],
    # Indochina & Thailand landmass (leaving Malacca Strait open)
    [
        (98.5, 8.5), (100.5, 7.5), (102.5, 11.0), (105.0, 10.5), (107.0, 12.0),
        (108.5, 16.0), (100.0, 20.0), (97.0, 16.0), (98.0, 12.0)
    ],
    # Sumatra landmass (leaving Singapore and Malacca open)
    [
        (95.2, 5.5), (97.5, 3.5), (100.0, 1.0), (102.5, -1.0), (105.5, -4.5),
        (104.5, -5.5), (102.0, -3.5), (98.5, -0.5), (96.0, 2.5)
    ]
]


class OceanGrid:
    """
    Represents a discrete coordinate grid of the maritime space.
    Resolution is configurable (default 0.5 degrees).
    """
    def __init__(self, resolution_deg: float = 0.5):
        self.resolution = resolution_deg
        self.obstacles: List[List[Tuple[float, float]]] = LANDMASS_POLYGONS

    def is_navigable(self, lat: float, lon: float) -> bool:
        """
        Check whether coordinates fall in open water or intersect landmass.
        """
        # Ensure within global geographic bounds
        if lat < -85.0 or lat > 85.0 or lon < -180.0 or lon > 180.0:
            return False

        # Check against landmass obstacle polygons
        for poly in self.obstacles:
            if point_in_polygon(lon, lat, poly):
                return False

        return True

    def snap_to_grid(self, lat: float, lon: float) -> Tuple[float, float]:
        """
        Snap continuous geographic coordinates to the nearest grid node.
        """
        grid_lat = round(lat / self.resolution) * self.resolution
        grid_lon = round(lon / self.resolution) * self.resolution
        grid_lat = round(grid_lat, 4)
        grid_lon = round(grid_lon, 4)

        # If snapped node is on land, search immediate neighbors for navigable water
        if not self.is_navigable(grid_lat, grid_lon):
            for d_lat in [-self.resolution, self.resolution, 0.0]:
                for d_lon in [-self.resolution, self.resolution, 0.0]:
                    cand_lat = round(grid_lat + d_lat, 4)
                    cand_lon = round(grid_lon + d_lon, 4)
                    if self.is_navigable(cand_lat, cand_lon):
                        return (cand_lat, cand_lon)

        return (grid_lat, grid_lon)

    def get_neighbors(self, lat: float, lon: float, penalty_zones: Optional[List[Tuple[float, float, float, float]]] = None) -> List[Tuple[float, float, float]]:
        """
        Return accessible 8-way adjacent grid neighbors with edge cost.
        Straight moves: step cost = 1.0 * distance
        Diagonal moves: step cost = sqrt(2) * distance
        """
        neighbors = []
        # Directions: (d_lat, d_lon, move_factor)
        directions = [
            (self.resolution, 0.0, 1.0),                  # North
            (-self.resolution, 0.0, 1.0),                 # South
            (0.0, self.resolution, 1.0),                  # East
            (0.0, -self.resolution, 1.0),                 # West
            (self.resolution, self.resolution, math.sqrt(2)),    # NE
            (self.resolution, -self.resolution, math.sqrt(2)),   # NW
            (-self.resolution, self.resolution, math.sqrt(2)),   # SE
            (-self.resolution, -self.resolution, math.sqrt(2))   # SW
        ]

        for d_lat, d_lon, factor in directions:
            n_lat = round(lat + d_lat, 4)
            n_lon = round(lon + d_lon, 4)
            if self.is_navigable(n_lat, n_lon):
                cost = factor
                # Apply penalty if neighbor is within penalized avoidance zone
                if penalty_zones:
                    for min_lat, max_lat, min_lon, max_lon in penalty_zones:
                        if min_lat <= n_lat <= max_lat and min_lon <= n_lon <= max_lon:
                            cost *= 3.0
                neighbors.append((n_lat, n_lon, cost))

        return neighbors
