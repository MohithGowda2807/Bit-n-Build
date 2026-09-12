from app.config import settings


class FuelModel:
    """
    Deterministic maritime fuel consumption model.
    Accounts for hydrodynamic hull resistance (cubic speed relationship)
    and displacement draft / cargo loading factors.
    """
    def __init__(
        self,
        reference_speed_knots: float = settings.REFERENCE_SPEED_KNOTS,
        fuel_price_per_liter: float = settings.FUEL_PRICE_PER_LITER,
        cargo_factor_coef: float = settings.CARGO_FACTOR_COEFFICIENT
    ):
        self.reference_speed_knots = reference_speed_knots
        self.fuel_price_per_liter = fuel_price_per_liter
        self.cargo_factor_coef = cargo_factor_coef

    def calculate_speed_factor(self, actual_speed_knots: float) -> float:
        """
        Speed factor modeling cubic power demand: (v / v_ref)^3
        """
        if self.reference_speed_knots <= 0 or actual_speed_knots <= 0:
            return 1.0
        return (actual_speed_knots / self.reference_speed_knots) ** 3

    def calculate_cargo_factor(self, cargo_tonnes: float) -> float:
        """
        Cargo loading factor: 1 + c * cargo_weight
        """
        return 1.0 + (self.cargo_factor_coef * max(0.0, cargo_tonnes))

    def calculate_consumption(
        self,
        base_rate_lph: float,
        speed_knots: float,
        cargo_tonnes: float,
        duration_hours: float
    ) -> float:
        """
        Calculate total fuel consumption in liters.
        """
        if duration_hours <= 0:
            return 0.0

        speed_factor = self.calculate_speed_factor(speed_knots)
        cargo_factor = self.calculate_cargo_factor(cargo_tonnes)

        hourly_consumption = base_rate_lph * speed_factor * cargo_factor
        total_liters = duration_hours * hourly_consumption
        return round(total_liters, 2)

    def calculate_cost(self, fuel_liters: float) -> float:
        """
        Calculate estimated fuel cost in USD.
        """
        return round(fuel_liters * self.fuel_price_per_liter, 2)
