from app.config import settings


class EmissionService:
    def __init__(self, emission_factor: float = settings.CO2_EMISSION_FACTOR):
        self.emission_factor = emission_factor

    def compute_co2(self, fuel_liters: float) -> float:
        """
        Calculate total estimated CO2 emissions in kilograms.
        Factor represents kg CO2 per liter of marine gas oil / fuel oil.
        """
        return round(max(0.0, fuel_liters) * self.emission_factor, 2)
