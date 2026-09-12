import heapq
import math
from typing import List, Tuple, Optional, Set, Dict
from app.services.routing.grid import OceanGrid
from app.services.routing.geometry import haversine_distance


class AStarRouter:
    """
    A* Maritime Pathfinding Router.
    Finds optimal obstacle-avoiding paths across the ocean grid.
    """
    def __init__(self, grid: Optional[OceanGrid] = None):
        self.grid = grid or OceanGrid()

    def find_path(
        self,
        start_lat: float,
        start_lon: float,
        goal_lat: float,
        goal_lon: float,
        penalty_zones: Optional[List[Tuple[float, float, float, float]]] = None,
        max_iterations: int = 25000
    ) -> Optional[List[Tuple[float, float]]]:
        """
        Executes A* search from start to goal.
        Returns list of (lat, lon) path coordinates, or None if no route found.
        """
        if not self.grid.is_navigable(start_lat, start_lon) or \
           not self.grid.is_navigable(goal_lat, goal_lon):
            return None

        start_node = self.grid.snap_to_grid(start_lat, start_lon)
        goal_node = self.grid.snap_to_grid(goal_lat, goal_lon)

        if start_node == goal_node:
            return [(start_lat, start_lon), (goal_lat, goal_lon)]

        # Priority queue stores: (f_score, counter, current_node)
        counter = 0
        open_set = []
        h_start = haversine_distance(start_node[0], start_node[1], goal_node[0], goal_node[1])
        heapq.heappush(open_set, (h_start, counter, start_node))

        came_from: Dict[Tuple[float, float], Tuple[float, float]] = {}
        g_score: Dict[Tuple[float, float], float] = {start_node: 0.0}
        closed_set: Set[Tuple[float, float]] = set()

        iterations = 0
        while open_set and iterations < max_iterations:
            iterations += 1
            current_f, _, current = heapq.heappop(open_set)

            if current in closed_set:
                continue
            closed_set.add(current)

            # Check if reached goal (within 1 resolution cell)
            dist_to_goal = haversine_distance(current[0], current[1], goal_node[0], goal_node[1])
            if dist_to_goal <= (self.grid.resolution * 111.0 * 1.1):
                # Reconstruct path
                path = [goal_node]
                curr = current
                while curr in came_from:
                    path.append(curr)
                    curr = came_from[curr]
                path.append(start_node)
                path.reverse()

                # Replace exact endpoints
                coords = [(start_lat, start_lon)]
                for p in path[1:-1]:
                    coords.append(p)
                coords.append((goal_lat, goal_lon))
                return coords

            for n_lat, n_lon, move_factor in self.grid.get_neighbors(current[0], current[1], penalty_zones):
                neighbor = (n_lat, n_lon)
                if neighbor in closed_set:
                    continue

                step_distance_km = haversine_distance(current[0], current[1], n_lat, n_lon) * move_factor
                tentative_g = g_score[current] + step_distance_km

                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    h_score = haversine_distance(n_lat, n_lon, goal_node[0], goal_node[1])
                    f_score = tentative_g + h_score
                    counter += 1
                    heapq.heappush(open_set, (f_score, counter, neighbor))

        return None
