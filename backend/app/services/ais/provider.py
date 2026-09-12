"""Provider abstraction: agents consume normalized AIS records, never raw APIs."""
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import List, Optional, Tuple

BoundingBox = Tuple[float, float, float, float]  # min_lat, min_lon, max_lat, max_lon


@dataclass(frozen=True)
class AISVesselInfo:
    mmsi: str
    name: str
    vessel_type: str
    flag: Optional[str] = None
    imo_number: Optional[str] = None
    callsign: Optional[str] = None


@dataclass(frozen=True)
class AISReport:
    mmsi: str
    timestamp: datetime
    latitude: float
    longitude: float
    speed_over_ground: float
    course_over_ground: float
    heading: Optional[float] = None
    navigation_status: Optional[str] = None
    source: str = "AIS"


class AISProvider(ABC):
    @abstractmethod
    def get_vessels(self, area: Optional[BoundingBox] = None) -> List[AISVesselInfo]: ...

    @abstractmethod
    def get_vessel(self, mmsi: str) -> Optional[AISVesselInfo]: ...

    @abstractmethod
    def get_track(self, mmsi: str, start_time: datetime, end_time: datetime) -> List[AISReport]: ...

    @abstractmethod
    def get_positions(
        self, area: Optional[BoundingBox] = None, time_range: Optional[Tuple[datetime, datetime]] = None
    ) -> List[AISReport]: ...
