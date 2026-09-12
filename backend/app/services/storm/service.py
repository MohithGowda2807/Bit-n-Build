import math
import logging
from datetime import datetime
from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from app.models.storm import Storm
from app.schemas.storm import StormCreate

logger = logging.getLogger("oceansentinel.storm")


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two coordinates in km using Haversine formula."""
    r = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2.0) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2.0) ** 2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return r * c


class StormService:
    """
    Manages active storm tracking, proximity queries, route intersection calculations,
    and scenario injection for hackathon demonstration.
    """

    def get_active_storms(self, db: Session) -> List[Storm]:
        return db.query(Storm).filter(Storm.is_active == True).all()

    def get_storm_by_id(self, db: Session, storm_id: int) -> Optional[Storm]:
        return db.query(Storm).filter(Storm.id == storm_id).first()

    def create_storm(self, db: Session, storm_in: StormCreate) -> Storm:
        storm = Storm(
            name=storm_in.name,
            storm_type=storm_in.storm_type,
            severity=storm_in.severity,
            center_latitude=storm_in.center_latitude,
            center_longitude=storm_in.center_longitude,
            radius_km=storm_in.radius_km,
            wind_speed_knots=storm_in.wind_speed_knots,
            movement_direction_deg=storm_in.movement_direction_deg,
            movement_speed_knots=storm_in.movement_speed_knots,
            forecast_time=storm_in.forecast_time,
            is_active=storm_in.is_active,
            source=storm_in.source,
            created_at=datetime.utcnow()
        )
        db.add(storm)
        db.commit()
        db.refresh(storm)
        logger.info(f"Created storm: {storm.name} ({storm.severity}) at ({storm.center_latitude}, {storm.center_longitude})")
        return storm

    def deactivate_storm(self, db: Session, storm_id: int) -> bool:
        storm = db.query(Storm).filter(Storm.id == storm_id).first()
        if not storm:
            return False
        storm.is_active = False
        db.commit()
        return True

    def clear_all_storms(self, db: Session) -> int:
        count = db.query(Storm).filter(Storm.is_active == True).update({"is_active": False})
        db.commit()
        return count

    def calculate_storm_proximity(self, lat: float, lon: float, db: Session) -> Tuple[Optional[Storm], float]:
        """
        Finds the closest active storm and returns (storm, distance_km).
        If no active storms, returns (None, 99999.0).
        """
        storms = self.get_active_storms(db)
        if not storms:
            return None, 99999.0

        closest_storm = None
        min_dist = float("inf")
        for s in storms:
            d = haversine_km(lat, lon, s.center_latitude, s.center_longitude)
            if d < min_dist:
                min_dist = d
                closest_storm = s

        return closest_storm, min_dist

    def check_route_storm_intersection(self, coordinates: List[List[float]], db: Session) -> List[Dict[str, Any]]:
        """
        Checks if any point along the route [[lon, lat], ...] enters an active storm's radius.
        Returns list of hazard records with storm details, min distance to center, and core intersection flag.
        """
        storms = self.get_active_storms(db)
        if not storms or not coordinates:
            return []

        intersections = []
        for s in storms:
            min_dist_to_center = float("inf")
            inside_outer = False
            inside_core = False

            for pt in coordinates:
                lon, lat = pt[0], pt[1]
                dist = haversine_km(lat, lon, s.center_latitude, s.center_longitude)
                if dist < min_dist_to_center:
                    min_dist_to_center = dist
                if dist <= s.radius_km:
                    inside_outer = True
                if dist <= (s.radius_km * 0.4):  # Inner 40% is dangerous core
                    inside_core = True

            if inside_outer:
                intersections.append({
                    "storm_id": s.id,
                    "storm_name": s.name,
                    "severity": s.severity,
                    "center": [s.center_latitude, s.center_longitude],
                    "radius_km": s.radius_km,
                    "min_distance_km": round(min_dist_to_center, 1),
                    "intersects_outer_buffer": True,
                    "intersects_core": inside_core,
                    "wind_speed_knots": s.wind_speed_knots
                })

        return intersections

    def inject_preset_scenario(self, db: Session, scenario_preset: str) -> List[Storm]:
        """
        Injects a realistic maritime storm scenario onto a key commercial shipping corridor
        for live hackathon demonstrations.
        """
        # Clear existing active storms to make demo clean and repeatable
        self.clear_all_storms(db)

        created = []
        if scenario_preset == "bay_of_bengal_cyclone":
            # Cyclone Vardah directly on the Chennai/Bay of Bengal -> Malacca corridor
            created.append(self.create_storm(db, StormCreate(
                name="Severe Cyclone Vardah",
                storm_type="cyclone",
                severity="critical",
                center_latitude=12.8,
                center_longitude=84.8,
                radius_km=240.0,
                wind_speed_knots=75.0,
                movement_direction_deg=290.0,
                movement_speed_knots=11.0,
                source="regional-specialized-meteorological-centre"
            )))
        elif scenario_preset == "malacca_squall":
            # Violent tropical squall blocking entrance to Malacca Strait
            created.append(self.create_storm(db, StormCreate(
                name="Sumatra Squall Front",
                storm_type="tropical_storm",
                severity="high",
                center_latitude=4.8,
                center_longitude=98.2,
                radius_km=140.0,
                wind_speed_knots=50.0,
                movement_direction_deg=75.0,
                movement_speed_knots=18.0,
                source="malacca-vts-weather"
            )))
        elif scenario_preset == "arabian_sea_monsoon":
            # Deep Monsoon Depression in Arabian Sea (Mumbai -> Gulf corridor)
            created.append(self.create_storm(db, StormCreate(
                name="Arabian Sea Depression ARB-02",
                storm_type="depression",
                severity="high",
                center_latitude=17.2,
                center_longitude=68.4,
                radius_km=260.0,
                wind_speed_knots=46.0,
                movement_direction_deg=315.0,
                movement_speed_knots=12.0,
                source="imd-cyclone-warning"
            )))
        else:
            # Generic tropical storm
            created.append(self.create_storm(db, StormCreate(
                name="Tropical Storm Maya",
                storm_type="tropical_storm",
                severity="high",
                center_latitude=11.5,
                center_longitude=86.0,
                radius_km=160.0,
                wind_speed_knots=52.0,
                movement_direction_deg=45.0,
                movement_speed_knots=14.0,
                source="wmo-marine-bulletin"
            )))

        return created


storm_service = StormService()
