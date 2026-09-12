import pytest
from app.services.fuel.model import FuelModel


def test_fuel_consumption_positive_and_monotonic():
    model = FuelModel()
    base_lph = 150.0
    speed = 14.0
    cargo = 10000.0

    fuel_10h = model.calculate_consumption(base_lph, speed, cargo, duration_hours=10.0)
    fuel_20h = model.calculate_consumption(base_lph, speed, cargo, duration_hours=20.0)

    assert fuel_10h > 0
    assert fuel_20h > fuel_10h
    assert pytest.approx(fuel_20h, rel=1e-2) == (fuel_10h * 2.0)


def test_speed_factor_cubic_relationship():
    model = FuelModel(reference_speed_knots=15.0)

    factor_ref = model.calculate_speed_factor(15.0)
    assert factor_ref == 1.0

    # At 20 knots, speed factor should be (20/15)^3 = (4/3)^3 = ~2.37
    factor_20 = model.calculate_speed_factor(20.0)
    assert pytest.approx(factor_20, rel=1e-2) == (20.0 / 15.0) ** 3

    # At 10 knots, speed factor should be (10/15)^3 = (2/3)^3 = ~0.296
    factor_10 = model.calculate_speed_factor(10.0)
    assert pytest.approx(factor_10, rel=1e-2) == (10.0 / 15.0) ** 3
    assert factor_20 > factor_ref > factor_10


def test_cargo_loading_factor():
    model = FuelModel(cargo_factor_coef=0.0005)

    factor_empty = model.calculate_cargo_factor(0.0)
    assert factor_empty == 1.0

    factor_loaded = model.calculate_cargo_factor(10000.0)
    assert factor_loaded == 1.0 + (0.0005 * 10000.0)
    assert factor_loaded > factor_empty
