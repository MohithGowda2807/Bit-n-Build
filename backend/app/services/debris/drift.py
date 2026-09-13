import math
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta


def calculate_leeway_drift_vector(
    current_speed_knots: float,
    current_heading_deg: float,
    wind_speed_knots: float,
    wind_direction_deg: float,
    current_alpha: float = 1.0,
    wind_beta: float = 0.03
) -> Dict[str, float]:
    """
    Computes resultant surface drift velocity vector using the leeway formulation:
    V_drift = alpha * V_current + beta * V_wind
    """
    # Convert headings (degrees from North) to mathematical radians (East = 0, North = 90)
    # Nautical convention: 0 deg = North, 90 deg = East, 180 deg = South, 270 deg = West.
    # u = v * sin(rad), v = v * cos(rad)
    cur_rad = math.radians(current_heading_deg)
    u_cur = current_alpha * current_speed_knots * math.sin(cur_rad)
    v_cur = current_alpha * current_speed_knots * math.cos(cur_rad)

    wind_rad = math.radians(wind_direction_deg)
    u_wind = wind_beta * wind_speed_knots * math.sin(wind_rad)
    v_wind = wind_beta * wind_speed_knots * math.cos(wind_rad)

    # Net drift components
    u_net = u_cur + u_wind
    v_net = v_cur + v_wind

    net_speed = math.sqrt(u_net**2 + v_net**2)
    # Heading in nautical degrees: atan2(u, v)
    heading_deg = (math.degrees(math.atan2(u_net, v_net)) + 360.0) % 360.0

    return {
        "drift_speed_knots": round(net_speed, 2),
        "drift_heading_deg": round(heading_deg, 1),
        "u_knots": u_net,
        "v_knots": v_net
    }


UNCERTAINTY_BASE_NM = 0.2            # position fix error at t=0
UNCERTAINTY_GROWTH_NM_PER_HOUR = 0.1  # unresolved current and wind variability
UNCERTAINTY_DRIFT_FRACTION = 0.1      # share of the distance drifted


def predict_drift_trajectory(
    start_lat: float,
    start_lon: float,
    forecast_hours: int = 24,
    current_speed_knots: float = 1.2,
    current_heading_deg: float = 85.0,
    wind_speed_knots: float = 15.0,
    wind_direction_deg: float = 65.0,
    debris_type: str = "ghost_net"
) -> List[Dict[str, Any]]:
    """
    Simulates hourly forward positions for a floating debris cluster.
    Adjusts leeway wind coefficient based on debris buoyancy:
    - ghost_net / microplastics: low leeway (beta = 0.02)
    - plastic_patch / container: higher windage (beta = 0.035 - 0.045)
    """
    beta_map = {
        "ghost_net": 0.022,
        "microplastic_cluster": 0.018,
        "plastic_patch": 0.035,
        "container_hazard": 0.042,
        "chemical_slick": 0.030
    }
    beta = beta_map.get(debris_type, 0.030)

    vector = calculate_leeway_drift_vector(
        current_speed_knots,
        current_heading_deg,
        wind_speed_knots,
        wind_direction_deg,
        current_alpha=1.0,
        wind_beta=beta
    )

    trajectory = []
    curr_lat = start_lat
    curr_lon = start_lon
    start_time = datetime.utcnow()

    drift_speed = vector["drift_speed_knots"]

    def uncertainty_radius_nm(hour: int) -> float:
        """Search radius around the forecast point: a fix error plus a share of the distance drifted."""
        return round(UNCERTAINTY_BASE_NM + UNCERTAINTY_GROWTH_NM_PER_HOUR * hour + UNCERTAINTY_DRIFT_FRACTION * drift_speed * hour, 2)

    # Initial t=0 waypoint
    trajectory.append({
        "hour": 0,
        "latitude": round(curr_lat, 5),
        "longitude": round(curr_lon, 5),
        "timestamp": start_time.isoformat() + "Z",
        "current_speed_knots": current_speed_knots,
        "wind_speed_knots": wind_speed_knots,
        "uncertainty_radius_nm": uncertainty_radius_nm(0),
    })

    heading_deg = vector["drift_heading_deg"]
    heading_rad = math.radians(heading_deg)

    for h in range(1, forecast_hours + 1):
        # Hourly nautical displacement: speed * 1 hour = nautical miles
        # 1 nm latitude = 1 / 60 degrees
        # 1 nm longitude = 1 / (60 * cos(lat)) degrees
        delta_lat = (drift_speed * math.cos(heading_rad)) / 60.0
        lat_rad = math.radians(curr_lat)
        cos_lat = math.cos(lat_rad)
        if abs(cos_lat) < 1e-6:
            cos_lat = 1e-6
        delta_lon = (drift_speed * math.sin(heading_rad)) / (60.0 * cos_lat)

        curr_lat += delta_lat
        curr_lon += delta_lon
        t = start_time + timedelta(hours=h)

        trajectory.append({
            "hour": h,
            "latitude": round(curr_lat, 5),
            "longitude": round(curr_lon, 5),
            "timestamp": t.isoformat() + "Z",
            "current_speed_knots": current_speed_knots,
            "wind_speed_knots": wind_speed_knots,
            "uncertainty_radius_nm": uncertainty_radius_nm(h),
        })

    return trajectory
