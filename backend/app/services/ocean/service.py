import math
import logging
from datetime import datetime
from app.schemas.weather import OceanCurrentData

logger = logging.getLogger("oceansentinel.ocean")


class OceanService:
    """
    Ocean Hydrodynamic and Current Integration Service.
    Models surface current vectors, salinity (PSU), and tidal phases.
    """

    def get_ocean_currents(self, lat: float, lon: float) -> OceanCurrentData:
        # Hydrodynamic approximation based on oceanic gyres and latitude
        abs_lat = abs(lat)

        # Equatorial counter-currents and western boundary currents
        if abs_lat < 10:
            current_speed = round(1.8 + 0.6 * math.sin(lon * 0.1), 2)
            direction = 90.0 if lat >= 0 else 270.0
            salinity = 34.8
            tide = "Ebb Current"
        elif 25 <= abs_lat <= 40 and (-80 <= lon <= -60 or 120 <= lon <= 150):
            # Western boundary currents (e.g. Gulf Stream / Kuroshio)
            current_speed = round(3.2 + 0.8 * math.cos(lat * 0.1), 2)
            direction = 45.0
            salinity = 36.2
            tide = "Flood Tide"
        else:
            current_speed = round(0.8 + 0.4 * math.sin(lat * 0.3 + lon * 0.3), 2)
            direction = round((abs(lon * 11.0 + lat * 5.0)) % 360.0, 1)
            salinity = round(35.0 + 0.5 * math.sin(lat * 0.05), 1)
            tide = "Slack Water"

        sst = round(max(2.0, 29.0 - (abs_lat * 0.5) + math.sin(lon * 0.1)), 1)

        return OceanCurrentData(
            latitude=lat,
            longitude=lon,
            current_speed_knots=current_speed,
            current_direction_deg=direction,
            sea_surface_temp_c=sst,
            salinity_psu=salinity,
            tidal_state=tide,
            source="oceanic-gyre-hydrodynamic-model",
            timestamp=datetime.utcnow()
        )


ocean_service = OceanService()
