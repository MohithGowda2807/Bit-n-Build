from app.services.routing.astar import AStarRouter
from app.services.routing.grid import OceanGrid


def test_astar_finds_valid_navigable_path():
    router = AStarRouter()
    # Path in open Arabian Sea: (12.0, 65.0) to (14.0, 68.0)
    path = router.find_path(12.0, 65.0, 14.0, 68.0)

    assert path is not None
    assert len(path) >= 2
    assert path[0] == (12.0, 65.0)
    assert path[-1] == (14.0, 68.0)


def test_astar_enclosed_destination_returns_none():
    grid = OceanGrid(resolution_deg=1.0)
    # Define an artificial box obstacle that encloses (20.0, 75.0)
    grid.obstacles = [
        [(74.0, 21.0), (76.0, 21.0), (76.0, 19.0), (74.0, 19.0)]
    ]
    router = AStarRouter(grid=grid)

    # Destination is right inside the non-navigable obstacle box
    path = router.find_path(15.0, 70.0, 20.0, 75.0)
    assert path is None
