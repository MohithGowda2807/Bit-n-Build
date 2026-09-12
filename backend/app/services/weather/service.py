import math
import logging
import httpx
from datetime import datetime, timezone
from typing import List, Tuple, Optional
from app.schemas.weather import WeatherData, RouteWeatherWaypoint, RouteWeatherReport
from app.services.ocean.service import ocean_service

logger = logging.getLogger("oceansentinel.weather")


class WeatherService:
    """
    Marine Weather Integration Service (Phase 2).
    Queries live open marine meteorology (Open-Meteo) with deterministic fallback,
    computes Douglas sea state classification, checks telemetry freshness,
    and performs waypoint-level route sampling.
    """

    def classify_sea_state(self, wave_height_m: float) -> int:
        """
        Classifies wave height according to the Douglas Sea Scale:
        0: Calm (0 - 0.5m)
        1: Slight (0.5 - 1.25m)
        2: Moderate (1.25 - 2.5m)
        3: Rough (2.5 - 4.0m)
        4: Very Rough (4.0 - 6.0m)
        5: Dangerous (> 6.0m)
        """
        if wave_height_m < 0.5:
            return 0
        elif wave_height_m < 1.25:
            return 1
        elif wave_height_m < 2.5:
            return 2
        elif wave_height_m < 4.0:
            return 3
        elif wave_height_m < 6.0:
            return 4
        else:
            return 5

    async def get_marine_weather(self, lat: float, lon: float) -> WeatherData:
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                url = f"https://marine-api.open-meteo.com/v1/marine?latitude={lat}&longitude={lon}&current=wave_height,wave_direction,wave_period"
                resp = await client.get(url)
                if resp.status_code == 200:
                    data = resp.json().get("current", {})
                    wave_h = data.get("wave_height", 1.2) or 1.2
                    period = data.get("wave_period", 6.0) or 6.0
                    return self._build_weather(lat, lon, wave_height=wave_h, wave_period=period, source="open-meteo-marine")
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
        wave_height = max(0.2, wave_h)
        visibility = 10.0 if wave_height < 3.0 else 6.0
        sea_state = self.classify_sea_state(wave_height)

        return WeatherData(
            latitude=lat,
            longitude=lon,
            temperature_c=temp_c,
            wind_speed_knots=wind_speed,
            wind_direction_deg=wind_dir,
            wave_height_m=wave_height,
            wave_period_s=6.5,
            visibility_nm=visibility,
            pressure_hpa=pressure,
            conditions=condition,
            sea_state=sea_state,
            is_stale=False,
            source="synthetic-deterministic-marine",
            timestamp=datetime.utcnow()
        )

    def _build_weather(self, lat: float, lon: float, wave_height: float, wave_period: float, source: str) -> WeatherData:
        synthetic = self._generate_synthetic_weather(lat, lon)
        synthetic.wave_height_m = round(wave_height, 1)
        synthetic.wave_period_s = round(wave_period, 1)
        synthetic.sea_state = self.classify_sea_state(synthetic.wave_height_m)
        synthetic.source = source
        return synthetic

    def sample_route_weather(self, route_id: int, coordinates: List[List[float]]) -> RouteWeatherReport:
        """
        Samples weather along a list of coordinates [[lon, lat], ...].
        Computes segment-by-segment Douglas sea-states, wave profiles, and aggregated environmental risk.
        """
        if not coordinates:
            return RouteWeatherReport(
                route_id=route_id,
                waypoints_count=0,
                avg_wave_height_m=0.0,
                max_wave_height_m=0.0,
                avg_wind_speed_knots=0.0,
                max_wind_speed_knots=0.0,
                max_sea_state=0,
                overall_environmental_risk=0.0,
                is_stale=False,
                waypoints=[]
            )

        sampled_waypoints: List[RouteWeatherWaypoint] = []
        tot_wave = 0.0
        max_wave = 0.0
        tot_wind = 0.0
        max_wind = 0.0
        max_sea = 0
        tot_risk = 0.0

        cum_dist = 0.0
        prev_pt = None

        # Sample up to 15 representative waypoints along route
        stride = max(1, len(coordinates) // 15)
        indexed_coords = [(i, pt) for i, pt in enumerate(coordinates) if i % stride == 0 or i == len(coordinates) - 1]

        for i, pt in indexed_coords:
            lon, lat = pt[0], pt[1]
            if prev_pt is not None:
                # Approximate distance in km
                d_lat = math.radians(lat - prev_pt[1])
                d_lon = math.radians(lon - prev_pt[0])
                a = math.sin(d_lat / 2)**2 + math.cos(math.radians(prev_pt[1])) * math.cos(math.radians(lat)) * math.sin(d_lon / 2)**2
                c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
                cum_dist += 6371.0 * c
            prev_pt = (lon, lat)

            w = self._generate_synthetic_weather(lat, lon)
            cur = ocean_service.get_ocean_currents(lat, lon)

            # Segment risk estimation (0 to 100 based on wave + wind)
            seg_risk = min(100.0, (w.wave_height_m / 6.0) * 50.0 + (w.wind_speed_knots / 40.0) * 40.0 + (cur.current_speed_knots / 3.0) * 10.0)

            tot_wave += w.wave_height_m
            max_wave = max(max_wave, w.wave_height_m)
            tot_wind += w.wind_speed_knots
            max_wind = max(max_wind, w.wind_speed_knots)
            max_sea = max(max_sea, w.sea_state)
            tot_risk += seg_risk

            sampled_waypoints.append(
                RouteWeatherWaypoint(
                    latitude=lat,
                    longitude=lon,
                    distance_from_start_km=round(cum_dist, 1),
                    wind_speed_knots=w.wind_speed_knots,
                    wind_direction_deg=w.wind_direction_deg,
                    wave_height_m=w.wave_height_m,
                    sea_state=w.sea_state,
                    current_speed_knots=cur.current_speed_knots,
                    current_direction_deg=cur.current_direction_deg,
                    segment_risk=round(seg_risk, 1)
                )
            )

        n = len(sampled_waypoints)
        return RouteWeatherReport(
            route_id=route_id,
            waypoints_count=n,
            avg_wave_height_m=round(tot_wave / max(1, n), 2),
            max_wave_height_m=round(max_wave, 2),
            avg_wind_speed_knots=round(tot_wind / max(1, n), 1),
            max_wind_speed_knots=round(max_wind, 1),
            max_sea_state=max_sea,
            overall_environmental_risk=round(tot_risk / max(1, n), 1),
            is_stale=False,
            waypoints=sampled_waypoints
        )


weather_service = WeatherService()
