import math
from typing import Tuple, List, Set, Optional
from app.services.routing.geometry import point_in_polygon

# Precise geographic landmass polygons in [lon, lat] format for accurate maritime navigation
LANDMASS_POLYGONS = [
    # 1. Indian Subcontinent Landmass (Western & Eastern peninsulas)
    [
        (68.5, 24.5), (70.0, 23.0), (70.5, 21.0), (72.5, 21.5), (72.85, 19.3),
        (73.0, 18.0), (73.3, 16.5), (73.6, 15.5), (74.2, 14.2), (74.8, 13.0),
        (75.3, 12.0), (75.8, 11.0), (76.2, 10.0), (76.5, 9.2), (76.9, 8.5), (77.55, 8.08),
        (78.2, 9.0), (79.2, 9.3), (79.8, 10.5), (80.3, 13.0),
        (81.5, 16.0), (83.0, 18.0), (85.5, 20.0), (88.0, 22.0),
        (90.0, 24.5), (80.0, 32.0), (68.5, 32.0)
    ],
    # 2. Sri Lanka Landmass
    [
        (79.6, 9.8), (81.0, 9.5), (81.9, 8.5), (81.8, 6.8), (81.0, 5.8), (80.3, 5.8), (79.8, 6.5), (79.6, 8.5)
    ],
    # 3. Palk Strait Shallow Barrier (Adam's Bridge non-navigable shallow reef forcing southern Sri Lanka rounding)
    [
        (78.9, 8.9), (80.3, 8.9), (80.3, 10.2), (78.9, 10.2)
    ],
    # 4. Peninsular Malaysia & Southern Thailand (between Andaman Sea & South China Sea)
    [
        (98.5, 10.0), (99.0, 8.0), (99.8, 6.5), (100.2, 5.4), (100.5, 4.2), (101.2, 3.0),
        (102.0, 2.2), (102.8, 1.8), (103.5, 1.35), (104.25, 1.35), (104.2, 2.5),
        (103.4, 3.8), (103.2, 5.0), (102.2, 6.2), (101.0, 6.8), (100.5, 8.5), (100.0, 10.0)
    ],
    # 5. Indochina Mainland (Myanmar, Thailand, Cambodia, Vietnam)
    [
        (97.5, 16.5), (99.0, 14.0), (100.5, 12.5), (101.5, 10.0), (104.0, 10.0),
        (107.0, 11.0), (109.0, 13.0), (108.0, 17.0), (100.0, 22.0), (95.0, 20.0), (94.0, 16.0)
    ],
    # 6. Sumatra Landmass (Indonesia, forming southern boundary of Malacca Strait)
    [
        (95.2, 5.8), (97.5, 3.5), (99.5, 1.8), (101.5, 0.5), (103.0, -1.5),
        (105.5, -4.5), (106.0, -5.8), (104.5, -5.5), (102.0, -3.5), (98.5, -0.5),
        (96.0, 2.5), (95.0, 5.5)
    ],
    # 7. Arabian Peninsula
    [
        (43.0, 13.0), (51.0, 12.0), (55.5, 17.0), (59.8, 22.5), (58.5, 24.5),
        (56.0, 26.0), (53.0, 24.0), (49.0, 26.0), (45.0, 29.0), (37.0, 28.0),
        (40.0, 21.0), (42.5, 16.0)
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
        if lat < -85.0 or lat > 85.0 or lon < -180.0 or lon > 180.0:
            return False

        # Check against landmass obstacle polygons
        for poly in self.obstacles:
            if point_in_polygon(lon, lat, poly):
                return False

        return True

    def snap_to_grid(self, lat: float, lon: float) -> Tuple[float, float]:
        """
        Snap continuous geographic coordinates to the nearest navigable grid node.
        """
        grid_lat = round(lat / self.resolution) * self.resolution
        grid_lon = round(lon / self.resolution) * self.resolution
        grid_lat = round(grid_lat, 4)
        grid_lon = round(grid_lon, 4)

        if not self.is_navigable(grid_lat, grid_lon):
            # Spiral search immediate neighbors for navigable water
            for radius in [1, 2, 3]:
                for d_lat in [-self.resolution * radius, self.resolution * radius, 0.0]:
                    for d_lon in [-self.resolution * radius, self.resolution * radius, 0.0]:
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
                if penalty_zones:
                    for min_lat, max_lat, min_lon, max_lon in penalty_zones:
                        if min_lat <= n_lat <= max_lat and min_lon <= n_lon <= max_lon:
                            cost *= 4.0
                neighbors.append((n_lat, n_lon, cost))

        return neighbors
