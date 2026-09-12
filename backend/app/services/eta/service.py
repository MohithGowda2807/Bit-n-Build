from datetime import datetime, timedelta
from typing import Tuple
from app.services.routing.geometry import km_to_nautical_miles


class ETAService:
    def compute_travel_time_hours(self, distance_km: float, speed_knots: float) -> float:
        """
        Calculate total travel time in hours based on nautical distance and speed.
        time = distance_nm / speed_knots
        """
        if speed_knots <= 0.1:
            return 0.0
        distance_nm = km_to_nautical_miles(distance_km)
        duration_hours = distance_nm / speed_knots
        return round(duration_hours, 2)

    def compute_eta(self, departure_time: datetime, duration_hours: float) -> datetime:
        """
        Calculate estimated arrival timestamp.
        """
        return departure_time + timedelta(hours=duration_hours)
