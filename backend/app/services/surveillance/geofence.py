"""Reusable geofencing over zones that carry a GeoJSON polygon in `geometry_geojson`."""
import json
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Protocol, Sequence

from shapely.geometry import LineString, Point, shape
from shapely.geometry.base import BaseGeometry
from shapely.ops import nearest_points

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


def _geometry(zone: Zone) -> BaseGeometry:
    return shape(json.loads(zone.geometry_geojson))


class GeofenceEngine:
    def is_inside(self, latitude: float, longitude: float, zone: Zone) -> bool:
        return _geometry(zone).covers(Point(longitude, latitude))

    def distance_to_zone_km(self, latitude: float, longitude: float, zone: Zone) -> float:
        geometry = _geometry(zone)
        point = Point(longitude, latitude)
        if geometry.covers(point):
            return 0.0
        nearest = nearest_points(geometry.boundary, point)[0]
        return haversine_distance(latitude, longitude, nearest.y, nearest.x)

    def trajectory_intersects_zone(self, track: Sequence[TrackPoint], zone: Zone) -> bool:
        if not track:
            return False
        if len(track) == 1:
            return self.is_inside(track[0].latitude, track[0].longitude, zone)
        line = LineString([(p.longitude, p.latitude) for p in track])
        return line.intersects(_geometry(zone))

    def zone_transitions(self, track: Sequence[TrackPoint], zone: Zone) -> List[ZoneTransition]:
        """Entry and exit events along a time-ordered track, based on observed points."""
        geometry = _geometry(zone)
        transitions: List[ZoneTransition] = []
        inside = False
        entered_at: Optional[datetime] = None
        for point in sorted(track, key=lambda p: p.timestamp):
            now_inside = geometry.covers(Point(point.longitude, point.latitude))
            if now_inside and not inside:
                entered_at = point.timestamp
                transitions.append(ZoneTransition("ZONE_ENTRY", point.timestamp, point.latitude, point.longitude, None))
            elif inside and not now_inside:
                dwell = (point.timestamp - entered_at).total_seconds() if entered_at else None
                transitions.append(ZoneTransition("ZONE_EXIT", point.timestamp, point.latitude, point.longitude, dwell))
            inside = now_inside
        return transitions
