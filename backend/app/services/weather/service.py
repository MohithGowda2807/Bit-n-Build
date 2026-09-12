import math
import logging
import httpx
from datetime import datetime
from typing import Optional
from app.schemas.weather import WeatherData

logger = logging.getLogger("oceansentinel.weather")


class WeatherService:
    """
    Marine Weather Integration Service.
    Queries live open marine meteorology (Open-Meteo) with deterministic fallback.
    """

    async def get_marine_weather(self, lat: float, lon: float) -> WeatherData:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&current=wave_height,wave_direction,wave_period"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json().get("current", {})
                    wave_h = data.get("wave_height", 1.2) or 1.2
                    return self._build_weather(lat, lon, wave_height=wave_h, source="open-meteo-marine")
        except Exception as e:
            logger.debug(f"Live marine weather fetch skipped/failed ({e}), using deterministic model.")

        return self._generate_synthetic_weather(lat, lon)

    def _generate_synthetic_weather(self, lat: float, lon: float) -> WeatherData:
        # Realistic synthetic atmospheric model based on coordinates
        abs_lat = abs(lat)
        temp_c = round(28.0 - (abs_lat * 0.4) + 2.0 * math.sin(lon * 0.05), 1)

        # Trade winds / Roaring Forties approximation
        if 40 <= abs_lat <= 60:
            wind_speed = round(22.0 + 8.0 * math.sin(lat * 0.1), 1)
            wave_h = round(3.5 + math.cos(lon * 0.1), 1)
            condition = "Rough Seas / Strong Gale"
        elif abs_lat < 15:
            wind_speed = round(8.0 + 4.0 * math.cos(lon * 0.1), 1)
            wave_h = round(0.8 + 0.3 * math.sin(lat), 1)
            condition = "Calm Tropical Waters"
        else:
            wind_speed = round(14.0 + 5.0 * math.sin(lon * 0.2), 1)
            wave_h = round(1.6 + 0.5 * math.cos(lat), 1)
            condition = "Moderate Swell"

        wind_dir = round((abs(lat * 15.0 + lon * 7.0)) % 360.0, 1)
        pressure = round(1013.25 + 5.0 * math.sin(lat * 0.2), 1)
        visibility = 10.0 if wave_h < 3.0 else 6.0

        return WeatherData(
            latitude=lat,
            longitude=lon,
            temperature_c=temp_c,
            wind_speed_knots=wind_speed,
            wind_direction_deg=wind_dir,
            wave_height_m=max(0.2, wave_h),
            visibility_nm=visibility,
            pressure_hpa=pressure,
            conditions=condition,
            source="synthetic-deterministic-marine",
            timestamp=datetime.utcnow()
        )

    def _build_weather(self, lat: float, lon: float, wave_height: float, source: str) -> WeatherData:
        synthetic = self._generate_synthetic_weather(lat, lon)
        synthetic.wave_height_m = round(wave_height, 1)
        synthetic.source = source
        return synthetic


weather_service = WeatherService()
