from app.services.fuel.model import FuelModel


class FuelService:
    def __init__(self):
        self.model = FuelModel()

    def compute_fuel(
        self,
        base_rate_lph: float,
        speed_knots: float,
        cargo_tonnes: float,
        duration_hours: float
    ) -> float:
        return self.model.calculate_consumption(
            base_rate_lph=base_rate_lph,
            speed_knots=speed_knots,
            cargo_tonnes=cargo_tonnes,
            duration_hours=duration_hours
        )

    def compute_cost(self, fuel_liters: float) -> float:
        return self.model.calculate_cost(fuel_liters)
