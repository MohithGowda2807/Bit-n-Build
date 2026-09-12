import pytest
from app.services.routing.geometry import (
    haversine_distance,
    km_to_nautical_miles,
    nautical_miles_to_km
)


def test_haversine_identical_coordinates():
    dist = haversine_distance(18.9438, 72.8364, 18.9438, 72.8364)
    assert dist == 0.0


def test_haversine_known_maritime_distance():
    # Mumbai to Singapore is roughly 3,850 - 3,950 km great-circle distance
    mumbai_lat, mumbai_lon = 18.9438, 72.8364
    singapore_lat, singapore_lon = 1.29027, 103.851959

    dist = haversine_distance(mumbai_lat, mumbai_lon, singapore_lat, singapore_lon)
    assert 3800.0 < dist < 4000.0


def test_nautical_miles_conversion():
    dist_km = 185.2
    nm = km_to_nautical_miles(dist_km)
    assert pytest.approx(nm, rel=1e-3) == 100.0

    km_back = nautical_miles_to_km(nm)
    assert pytest.approx(km_back, rel=1e-3) == dist_km
