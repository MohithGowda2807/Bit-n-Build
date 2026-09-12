"""Reusable geofencing over zones that carry a GeoJSON polygon in `geometry_geojson`."""
import json
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Protocol, Sequence, Any

try:
    from shapely.geometry import LineString, Point, shape
    from shapely.geometry.base import BaseGeometry
    from shapely.ops import nearest_points
    SHAPELY_AVAILABLE = True
except ImportError:
    SHAPELY_AVAILABLE = False

from app.services.routing.geometry import haversine_distance


class Zone(Protocol):
    geometry_geojson: str


@dataclass(frozen=True)
class TrackPoint:
    timestamp: datetime
    latitude: float
    longitude: float


@dataclass(frozen=True)
class ZoneTransition:
    kind: str  # ZONE_ENTRY or ZONE_EXIT
    timestamp: datetime
    latitude: float
    longitude: float
    dwell_seconds: Optional[float]  # set on ZONE_EXIT: time spent inside


def _point_in_poly(lon: float, lat: float, poly: List[List[float]]) -> bool:
    inside = False
    n = len(poly)
    if n < 3:
        return False
    p1x, p1y = poly[0][0], poly[0][1]
    for i in range(1, n + 1):
        p2x, p2y = poly[i % n][0], poly[i % n][1]
        if lat > min(p1y, p2y):
            if lat <= max(p1y, p2y):
                if lon <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (lat - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or lon <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside


def _get_poly_coords(zone: Zone) -> List[List[List[float]]]:
    try:
        data = json.loads(zone.geometry_geojson)
        if data.get("type") == "Polygon":
            return [data.get("coordinates", [[]])[0]]
        elif data.get("type") == "MultiPolygon":
            return [p[0] for p in data.get("coordinates", []) if p]
    except Exception:
        pass
    return []


def _geometry(zone: Zone) -> Any:
    if SHAPELY_AVAILABLE:
        return shape(json.loads(zone.geometry_geojson))
    return None


class GeofenceEngine:
    def is_inside(self, latitude: float, longitude: float, zone: Zone) -> bool:
        if SHAPELY_AVAILABLE:
            return _geometry(zone).covers(Point(longitude, latitude))
        rings = _get_poly_coords(zone)
        return any(_point_in_poly(longitude, latitude, ring) for ring in rings)

    def distance_to_zone_km(self, latitude: float, longitude: float, zone: Zone) -> float:
        if SHAPELY_AVAILABLE:
            geometry = _geometry(zone)
            point = Point(longitude, latitude)
            if geometry.covers(point):
                return 0.0
            nearest = nearest_points(geometry.boundary, point)[0]
            return haversine_distance(latitude, longitude, nearest.y, nearest.x)

        if self.is_inside(latitude, longitude, zone):
            return 0.0
        rings = _get_poly_coords(zone)
        min_dist = float("inf")
        for ring in rings:
            for pt in ring:
                d = haversine_distance(latitude, longitude, pt[1], pt[0])
                if d < min_dist:
                    min_dist = d
        return min_dist if min_dist != float("inf") else 999.0

    def trajectory_intersects_zone(self, track: Sequence[TrackPoint], zone: Zone) -> bool:
        if not track:
            return False
        if len(track) == 1:
            return self.is_inside(track[0].latitude, track[0].longitude, zone)
        if SHAPELY_AVAILABLE:
            line = LineString([(p.longitude, p.latitude) for p in track])
            return line.intersects(_geometry(zone))
        return any(self.is_inside(p.latitude, p.longitude, zone) for p in track)

    def zone_transitions(self, track: Sequence[TrackPoint], zone: Zone) -> List[ZoneTransition]:
        """Entry and exit events along a time-ordered track, based on observed points."""
        transitions: List[ZoneTransition] = []
        inside = False
        entered_at: Optional[datetime] = None
        for point in sorted(track, key=lambda p: p.timestamp):
            now_inside = self.is_inside(point.latitude, point.longitude, zone)
            if now_inside and not inside:
                entered_at = point.timestamp
                transitions.append(ZoneTransition("ZONE_ENTRY", point.timestamp, point.latitude, point.longitude, None))
            elif inside and not now_inside:
                dwell = (point.timestamp - entered_at).total_seconds() if entered_at else None
                transitions.append(ZoneTransition("ZONE_EXIT", point.timestamp, point.latitude, point.longitude, dwell))
            inside = now_inside
        return transitions
