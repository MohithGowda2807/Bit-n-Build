import math
import logging
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.storm import Storm
from app.models.vessel import Vessel
from app.models.route import Route
from app.models.voyage import Voyage
from app.services.storm.service import storm_service, haversine_km
from app.services.weather.service import weather_service
from app.services.ocean.service import ocean_service

logger = logging.getLogger("oceansentinel.risk_engine")


@dataclass
class EnvironmentalRiskFactor:
    name: str
    category: str  # STORM, WAVE, WIND, CURRENT, ZONE, VESSEL
    score: float  # contribution (0-100 normalized)
    severity: str  # LOW, MODERATE, HIGH, CRITICAL
    description: str


@dataclass
class RouteRiskAssessment:
    overall_score: float  # 0 to 100
    risk_level: str  # LOW, MODERATE, ELEVATED, HIGH, CRITICAL
    is_critical: bool
    requires_rerouting: bool
    primary_threat: Optional[str]
    factors: List[EnvironmentalRiskFactor]
    segment_risks: List[Dict[str, Any]]
    active_storms_intersecting: List[Dict[str, Any]]


class MaritimeRiskEngine:
    """
    Phase 2 Maritime Environmental & Dynamic Route Risk Engine.
    Evaluates routes, coordinates, and active voyages against evolving storms,
    sea-state wave severity, wind vectors, current shear, and vessel tolerances.
    """

    def get_risk_level(self, score: float) -> str:
        if score <= 20.0:
            return "LOW"
        elif score <= 40.0:
            return "MODERATE"
        elif score <= 60.0:
            return "ELEVATED"
        elif score <= 80.0:
            return "HIGH"
        else:
            return "CRITICAL"

    def assess_coordinate_risk(
        self,
        lat: float,
        lon: float,
        vessel_type: str = "container",
        db: Optional[Session] = None
    ) -> Tuple[float, List[EnvironmentalRiskFactor]]:
        """
        Computes composite environmental risk for a single point on the ocean.
        """
        factors: List[EnvironmentalRiskFactor] = []

        # 1. Weather & Wave Telemetry
        weather = weather_service._generate_synthetic_weather(lat, lon)
        ocean = ocean_service.get_ocean_currents(lat, lon)

        # Wave risk (Douglas Sea State: 0 to 5)
        # Max 25 points
        wave_pts = min(25.0, (weather.wave_height_m / 6.0) * 25.0)
        factors.append(EnvironmentalRiskFactor(
            name="Wave Action & Sea State",
            category="WAVE",
            score=round(wave_pts, 1),
            severity=self.get_risk_level(wave_pts * 4),
            description=f"Significant wave height {weather.wave_height_m:.1f}m ({weather.conditions}, State {weather.sea_state})"
        ))

        # Wind risk (Knots: > 35 kn is gale)
        # Max 15 points
        wind_pts = min(15.0, (weather.wind_speed_knots / 45.0) * 15.0)
        factors.append(EnvironmentalRiskFactor(
            name="Atmospheric Wind Force",
            category="WIND",
            score=round(wind_pts, 1),
            severity=self.get_risk_level(wind_pts * (100 / 15)),
            description=f"Wind speed {weather.wind_speed_knots:.1f} kn from {int(weather.wind_direction_deg)}°"
        ))

        # Ocean current resistance (Knots)
        # Max 10 points
        cur_pts = min(10.0, (ocean.current_speed_knots / 3.5) * 10.0)
        factors.append(EnvironmentalRiskFactor(
            name="Hydrodynamic Currents",
            category="CURRENT",
            score=round(cur_pts, 1),
            severity=self.get_risk_level(cur_pts * 10),
            description=f"Current {ocean.current_speed_knots:.2f} kn heading {int(ocean.current_direction_deg)}° ({ocean.tidal_state})"
        ))

        # 2. Storm Proximity (Max 50 points)
        storm_pts = 0.0
        if db:
            closest_storm, dist_km = storm_service.calculate_storm_proximity(lat, lon, db)
            if closest_storm:
                if dist_km <= (closest_storm.radius_km * 0.4):
                    # Inside core
                    storm_pts = 50.0
                    factors.append(EnvironmentalRiskFactor(
                        name="Storm Eye / Severe Core",
                        category="STORM",
                        score=50.0,
                        severity="CRITICAL",
                        description=f"Direct intersection with {closest_storm.name} core ({dist_km:.1f} km from eye, {closest_storm.wind_speed_knots} kn winds)"
                    ))
                elif dist_km <= closest_storm.radius_km:
                    # Inside outer buffer
                    ratio = 1.0 - (dist_km / closest_storm.radius_km)
                    storm_pts = 25.0 + (ratio * 20.0)
                    factors.append(EnvironmentalRiskFactor(
                        name="Storm Peripheral Buffer",
                        category="STORM",
                        score=round(storm_pts, 1),
                        severity="HIGH",
                        description=f"Inside {closest_storm.name} circulation ({dist_km:.1f} km from center, buffer {closest_storm.radius_km:.0f} km)"
                    ))
                elif dist_km <= (closest_storm.radius_km * 1.8):
                    # Storm feeder / approach
                    storm_pts = 10.0
                    factors.append(EnvironmentalRiskFactor(
                        name="Storm Approach Warning",
                        category="STORM",
                        score=10.0,
                        severity="ELEVATED",
                        description=f"Proximity to {closest_storm.name} ({dist_km:.1f} km from center)"
                    ))

        # 3. Vessel Type Modifier
        # Research / Small vessels suffer higher vulnerability to waves
        multiplier = 1.0
        vt_lower = (vessel_type or "").lower()
        if "research" in vt_lower or "fishing" in vt_lower:
            multiplier = 1.25
        elif "tanker" in vt_lower or "bulk" in vt_lower:
            multiplier = 0.9

        total_score = min(100.0, (wave_pts + wind_pts + cur_pts + storm_pts) * multiplier)
        return round(total_score, 1), factors

    def assess_route_risk(
        self,
        route: Route,
        db: Session,
        vessel: Optional[Vessel] = None
    ) -> RouteRiskAssessment:
        """
        Evaluates risk along all coordinates of a route.
        Identifies whether any storm intersects and whether dynamic re-routing is required.
        """
        import json
        try:
            coords = json.loads(route.geometry_geojson)
        except Exception:
            coords = []

        if not coords:
            return RouteRiskAssessment(
                overall_score=route.risk_score or 15.0,
                risk_level=self.get_risk_level(route.risk_score or 15.0),
                is_critical=False,
                requires_rerouting=False,
                primary_threat=None,
                factors=[],
                segment_risks=[],
                active_storms_intersecting=[]
            )

        vessel_type = vessel.vessel_type if vessel else "container"

        # Check storm intersections across the path
        intersecting_storms = storm_service.check_route_storm_intersection(coords, db)

        # Sample points along route
        stride = max(1, len(coords) // 12)
        sampled = [coords[i] for i in range(0, len(coords), stride)]
        if coords[-1] not in sampled:
            sampled.append(coords[-1])

        max_score = 0.0
        sum_score = 0.0
        segment_risks = []
        highest_threat = None

        for pt in sampled:
            lon, lat = pt[0], pt[1]
            pt_score, factors = self.assess_coordinate_risk(lat, lon, vessel_type=vessel_type, db=db)
            sum_score += pt_score
            if pt_score > max_score:
                max_score = pt_score
                # Find strongest factor
                if factors:
                    highest_threat = max(factors, key=lambda f: f.score).description

            segment_risks.append({
                "latitude": lat,
                "longitude": lon,
                "score": pt_score,
                "level": self.get_risk_level(pt_score)
            })

        avg_score = sum_score / max(1, len(sampled))
        # Composite score weights peak exposure (40%) and average (60%)
        composite_score = round(0.4 * max_score + 0.6 * avg_score, 1)

        is_critical = composite_score >= 80.0 or any(s.get("intersects_core") for s in intersecting_storms)
        requires_rerouting = composite_score >= 55.0 or len(intersecting_storms) > 0

        overall_factors = []
        if intersecting_storms:
            overall_factors.append(EnvironmentalRiskFactor(
                name="Intersecting Storm Cells",
                category="STORM",
                score=min(50.0, len(intersecting_storms) * 45.0),
                severity="CRITICAL" if any(s.get("intersects_core") for s in intersecting_storms) else "HIGH",
                description=f"Route traverses {len(intersecting_storms)} active storm boundary: {', '.join([s['storm_name'] for s in intersecting_storms])}"
            ))

        return RouteRiskAssessment(
            overall_score=composite_score,
            risk_level=self.get_risk_level(composite_score),
            is_critical=is_critical,
            requires_rerouting=requires_rerouting,
            primary_threat=highest_threat or ("Severe Storm" if intersecting_storms else "None"),
            factors=overall_factors,
            segment_risks=segment_risks,
            active_storms_intersecting=intersecting_storms
        )

    def calculate_voyage_health(self, voyage: Voyage, db: Session) -> Dict[str, Any]:
        """
        Calculates holistic voyage health metrics (spec section 68):
        Safety, Fuel Efficiency, Environmental Compliance, and ETA adherence.
        """
        if not voyage.route:
            return {
                "voyage_id": voyage.id,
                "overall_health": 85.0,
                "safety_score": 85.0,
                "fuel_efficiency_score": 85.0,
                "environmental_score": 90.0,
                "eta_adherence_score": 90.0,
                "current_risk": 20.0,
                "active_storms_count": 0,
                "route_status": "HEALTHY",
                "operating_mode": "autonomous",
                "alerts": []
            }

        assessment = self.assess_route_risk(voyage.route, db, voyage.vessel)
        current_risk = assessment.overall_score

        safety_score = max(0.0, round(100.0 - current_risk, 1))
        fuel_score = max(50.0, min(100.0, 95.0 - (current_risk * 0.2)))
        env_score = max(50.0, min(100.0, 98.0 - (current_risk * 0.15)))
        eta_score = max(40.0, min(100.0, 92.0 - (current_risk * 0.25)))

        overall_health = round(
            0.40 * safety_score +
            0.25 * fuel_score +
            0.20 * env_score +
            0.15 * eta_score,
            1
        )

        status_text = "HEALTHY"
        if assessment.is_critical:
            status_text = "CRITICAL_HAZARD"
        elif assessment.requires_rerouting:
            status_text = "ELEVATED_RISK"

        alerts = []
        if assessment.active_storms_intersecting:
            for s in assessment.active_storms_intersecting:
                alerts.append({
                    "severity": "CRITICAL" if s.get("intersects_core") else "HIGH",
                    "title": f"Storm Threat: {s['storm_name']}",
                    "message": f"Route penetrates storm perimeter with {s['wind_speed_knots']} kn winds at {s['min_distance_km']} km."
                })
        elif current_risk >= 50.0:
            alerts.append({
                "severity": "WARNING",
                "title": "Adverse Marine Conditions",
                "message": f"Elevated sea states and opposing currents increase voyage risk to {current_risk:.0f}/100."
            })

        return {
            "voyage_id": voyage.id,
            "overall_health": overall_health,
            "safety_score": safety_score,
            "fuel_efficiency_score": fuel_score,
            "environmental_score": env_score,
            "eta_adherence_score": eta_score,
            "current_risk": current_risk,
            "active_storms_count": len(assessment.active_storms_intersecting),
            "route_status": status_text,
            "operating_mode": "autonomous",
            "alerts": alerts
        }


risk_engine = MaritimeRiskEngine()
