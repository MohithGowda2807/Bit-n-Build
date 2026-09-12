import math
import json
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime


def calculate_power_consumption_kw(
    speed_knots: float,
    status: str,
    unit_type: str = "asv_skimmer"
) -> float:
    """
    Computes instantaneous electrical power demand (kW) for an autonomous marine unit.
    - Hotel load: computers, LiDAR, radar, satellite link
    - Propulsion: quadratic/cubic hydrodynamic drag curve
    - Auxiliary collection: mechanical skimmer conveyor / suction pump
    """
    base_hotel_kw = 0.6 if unit_type == "asv_skimmer" else 0.35

    # Propulsion load: P_prop = k * v^2.5
    propulsion_kw = 0.08 * (speed_knots ** 2.2)

    # Collection machinery load
    collection_kw = 0.0
    if status == "collecting":
        collection_kw = 3.5 if unit_type == "asv_skimmer" else 1.8

    return round(base_hotel_kw + propulsion_kw + collection_kw, 2)


class AutonomousUnitState:
    def __init__(
        self,
        unit_id: int,
        unit_name: str,
        unit_type: str,
        latitude: float,
        longitude: float,
        battery_pct: float = 100.0,
        battery_capacity_kwh: float = 80.0,
        capacity_kg: float = 1500.0,
        current_load_kg: float = 0.0,
        speed_knots: float = 8.0,
        status: str = "idle",
        waypoints: Optional[List[Dict[str, Any]]] = None,
        home_port_coords: Optional[Tuple[float, float]] = None
    ):
        self.unit_id = unit_id
        self.unit_name = unit_name
        self.unit_type = unit_type
        self.latitude = latitude
        self.longitude = longitude
        self.heading_deg = 0.0
        self.battery_pct = max(0.0, min(100.0, battery_pct))
        self.battery_capacity_kwh = battery_capacity_kwh
        self.capacity_kg = capacity_kg
        self.current_load_kg = current_load_kg
        self.speed_knots = speed_knots
        self.status = status  # idle, transit, collecting, returning, docked, hold
        self.waypoints = waypoints or []
        self.current_waypoint_index = 0
        self.home_port_coords = home_port_coords or (latitude, longitude)
        self.collection_timer_hours = 0.0

    def step(self, dt_hours: float = 0.25) -> Dict[str, Any]:
        """
        Advances the unit state by dt_hours (e.g. 15 minutes = 0.25 hours).
        Updates battery, payload, position, and waypoint transitions.
        """
        power_kw = calculate_power_consumption_kw(
            self.speed_knots if self.status in ["transit", "returning"] else 1.0,
            self.status,
            self.unit_type
        )
        # Energy consumed in kWh
        energy_kwh = power_kw * dt_hours
        battery_pct_drop = (energy_kwh / self.battery_capacity_kwh) * 100.0
        self.battery_pct = max(0.0, round(self.battery_pct - battery_pct_drop, 2))

        # Check critical battery threshold (<15%) -> force return
        if self.battery_pct < 15.0 and self.status not in ["returning", "docked"]:
            self.status = "returning"

        # Check full payload threshold (>90%) -> force return
        if self.current_load_kg >= (0.90 * self.capacity_kg) and self.status not in ["returning", "docked"]:
            self.status = "returning"

        # Move or work based on status
        if self.status == "collecting":
            # Collect at ~250 kg / hour
            collected = 250.0 * dt_hours
            self.current_load_kg = min(self.capacity_kg, round(self.current_load_kg + collected, 1))
            self.collection_timer_hours += dt_hours
            # Finish collecting after target time (~1.5 hours per patch)
            if self.collection_timer_hours >= 1.5:
                self.collection_timer_hours = 0.0
                self.current_waypoint_index += 1
                if self.current_waypoint_index < len(self.waypoints):
                    self.status = "transit"
                else:
                    self.status = "returning"

        elif self.status in ["transit", "returning"]:
            target_lat, target_lon = self._get_current_target()
            if target_lat is not None:
                self._move_towards(target_lat, target_lon, dt_hours)

        return self.to_dict()

    def _get_current_target(self) -> Tuple[Optional[float], Optional[float]]:
        if self.status == "returning":
            return self.home_port_coords
        if self.current_waypoint_index < len(self.waypoints):
            wp = self.waypoints[self.current_waypoint_index]
            return wp.get("latitude"), wp.get("longitude")
        return None, None

    def _move_towards(self, target_lat: float, target_lon: float, dt_hours: float):
        dlat = target_lat - self.latitude
        dlon = target_lon - self.longitude
        dist_nm = math.sqrt(dlat**2 + dlon**2) * 60.0

        # Bearing to target
        bearing_rad = math.atan2(dlon * math.cos(math.radians(self.latitude)), dlat)
        self.heading_deg = (math.degrees(bearing_rad) + 360.0) % 360.0

        # Step distance in nm
        step_nm = self.speed_knots * dt_hours

        if dist_nm <= step_nm or dist_nm < 0.05:
            # Waypoint reached
            self.latitude = target_lat
            self.longitude = target_lon

            if self.status == "returning":
                self.status = "docked"
            else:
                wp = self.waypoints[self.current_waypoint_index] if self.current_waypoint_index < len(self.waypoints) else {}
                action = wp.get("action", "transit")
                if action == "collect":
                    self.status = "collecting"
                    self.collection_timer_hours = 0.0
                elif action == "dock":
                    self.status = "docked"
                else:
                    self.current_waypoint_index += 1
                    if self.current_waypoint_index >= len(self.waypoints):
                        self.status = "returning"
        else:
            # Advance along bearing
            lat_step = (step_nm * math.cos(bearing_rad)) / 60.0
            lon_step = (step_nm * math.sin(bearing_rad)) / (60.0 * math.cos(math.radians(self.latitude)))
            self.latitude = round(self.latitude + lat_step, 5)
            self.longitude = round(self.longitude + lon_step, 5)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "unit_id": self.unit_id,
            "unit_name": self.unit_name,
            "unit_type": self.unit_type,
            "latitude": round(self.latitude, 5),
            "longitude": round(self.longitude, 5),
            "heading_deg": round(self.heading_deg, 1),
            "speed_knots": self.speed_knots,
            "battery_pct": round(self.battery_pct, 1),
            "capacity_kg": self.capacity_kg,
            "current_load_kg": round(self.current_load_kg, 1),
            "status": self.status,
            "current_waypoint_index": self.current_waypoint_index
        }
