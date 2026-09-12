from datetime import datetime, timezone
from app.services.eta.service import ETAService


def test_eta_travel_duration_and_speed_scaling():
    eta_service = ETAService()
    dist_km = 1852.0  # 1000 nautical miles

    # At 10 knots, duration = 1000 / 10 = 100 hours
    t_10 = eta_service.compute_travel_time_hours(dist_km, speed_knots=10.0)
    assert t_10 == 100.0

    # At 20 knots, duration = 1000 / 20 = 50 hours
    t_20 = eta_service.compute_travel_time_hours(dist_km, speed_knots=20.0)
    assert t_20 == 50.0
    assert t_20 < t_10


def test_eta_timestamp_projection():
    eta_service = ETAService()
    dep = datetime(2026, 9, 12, 12, 0, 0, tzinfo=timezone.utc)
    arrival = eta_service.compute_eta(dep, duration_hours=24.5)

    assert arrival.year == 2026
    assert arrival.month == 9
    assert arrival.day == 13
    assert arrival.hour == 12
    assert arrival.minute == 30
