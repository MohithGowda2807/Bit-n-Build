from app.services.debris.drift import calculate_leeway_drift_vector, predict_drift_trajectory
from app.services.debris.clustering import cluster_debris_sightings, haversine_distance_km


def test_leeway_drift_vector():
    # Test current alone (heading East = 90 deg, 1.5 knots, no wind)
    res = calculate_leeway_drift_vector(
        current_speed_knots=1.5,
        current_heading_deg=90.0,
        wind_speed_knots=0.0,
        wind_direction_deg=0.0
    )
    assert abs(res["drift_speed_knots"] - 1.5) < 0.05
    assert abs(res["drift_heading_deg"] - 90.0) < 0.5

    # Test current + wind combined
    res_combined = calculate_leeway_drift_vector(
        current_speed_knots=1.0,
        current_heading_deg=90.0,
        wind_speed_knots=20.0,
        wind_direction_deg=90.0,
        current_alpha=1.0,
        wind_beta=0.03
    )
    # Expected speed ~ 1.0 + 20*0.03 = 1.6 kt
    assert abs(res_combined["drift_speed_knots"] - 1.6) < 0.05
    assert abs(res_combined["drift_heading_deg"] - 90.0) < 0.5


def test_drift_trajectory():
    trajectory = predict_drift_trajectory(
        start_lat=10.0,
        start_lon=72.0,
        forecast_hours=12,
        current_speed_knots=1.5,
        current_heading_deg=90.0,
        wind_speed_knots=10.0,
        wind_direction_deg=90.0
    )
    assert len(trajectory) == 13  # 0 to 12
    assert trajectory[0]["hour"] == 0
    assert trajectory[0]["latitude"] == 10.0
    assert trajectory[0]["longitude"] == 72.0
    # Because heading is 90 deg (due East), longitude increases, latitude stays approximately constant
    assert trajectory[12]["longitude"] > 72.0
    assert abs(trajectory[12]["latitude"] - 10.0) < 0.01


def test_clustering():
    points = [
        {"id": 1, "latitude": 10.0, "longitude": 72.0, "estimated_mass_kg": 500.0, "debris_type": "ghost_net", "severity": 80.0},
        {"id": 2, "latitude": 10.05, "longitude": 72.05, "estimated_mass_kg": 700.0, "debris_type": "ghost_net", "severity": 85.0},
        {"id": 3, "latitude": 15.0, "longitude": 75.0, "estimated_mass_kg": 300.0, "debris_type": "plastic_patch", "severity": 40.0}
    ]
    clusters = cluster_debris_sightings(points, eps_km=30.0)
    assert len(clusters) == 2  # Cluster 1 (points 1 & 2), Cluster 2 (point 3)
    c1 = next(c for c in clusters if 1 in c["member_ids"])
    assert c1["member_count"] == 2
    assert c1["total_mass_kg"] == 1200.0
    assert c1["predominant_type"] == "ghost_net"
    assert c1["max_severity"] == 85.0
