"""Activity heatmap: AIS positions, detections and risk aggregated onto a lat/lon grid."""
import math
from dataclasses import dataclass
from datetime import timedelta
from typing import Dict, List, Optional, Tuple

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.ais_position import AISPosition
from app.models.surveillance_event import SurveillanceEvent
from app.models.vessel_risk_score import VesselRiskScore

RISK_WEIGHT = 0.5      # share of a cell's intensity that comes from the riskiest vessel seen there
EVENT_WEIGHT = 0.3     # share from how many detections happened there
POSITION_WEIGHT = 0.2  # share from how busy it is


@dataclass
class HeatCell:
    lat: float
    lon: float
    positions: int = 0
    events: int = 0
    max_risk: float = 0.0
    intensity: float = 0.0

    def as_dict(self) -> Dict:
        return {"lat": self.lat, "lon": self.lon, "positions": self.positions, "events": self.events,
                "max_risk": round(self.max_risk, 1), "intensity": round(self.intensity, 3)}


def cell_key(latitude: float, longitude: float, cell_degrees: float) -> Tuple[float, float]:
    """South-west corner of the cell containing the point, snapped to the grid."""
    steps = round(1.0 / cell_degrees)
    return (math.floor(latitude * steps) / steps, math.floor(longitude * steps) / steps)


def build_heatmap(db: Session, cell_degrees: float, hours: Optional[float] = None) -> List[HeatCell]:
    cells: Dict[Tuple[float, float], HeatCell] = {}

    def cell(lat: float, lon: float) -> HeatCell:
        key = cell_key(lat, lon, cell_degrees)
        if key not in cells:
            cells[key] = HeatCell(lat=key[0], lon=key[1])
        return cells[key]

    positions = db.query(AISPosition.vessel_id, AISPosition.latitude, AISPosition.longitude, AISPosition.timestamp)
    if hours is not None:
        newest = db.query(func.max(AISPosition.timestamp)).scalar()
        if newest is not None:
            positions = positions.filter(AISPosition.timestamp >= newest - timedelta(hours=hours))
    latest_risk = _latest_risk_by_vessel(db)
    for vessel_id, lat, lon, _ in positions.all():
        c = cell(lat, lon)
        c.positions += 1
        c.max_risk = max(c.max_risk, latest_risk.get(vessel_id, 0.0))

    for lat, lon in db.query(SurveillanceEvent.latitude, SurveillanceEvent.longitude).all():
        cell(lat, lon).events += 1

    if not cells:
        return []
    busiest = max(c.positions for c in cells.values()) or 1
    most_events = max(c.events for c in cells.values()) or 1
    for c in cells.values():
        c.intensity = (RISK_WEIGHT * c.max_risk / 100.0 + EVENT_WEIGHT * c.events / most_events
                       + POSITION_WEIGHT * c.positions / busiest)
    peak = max(c.intensity for c in cells.values()) or 1.0
    for c in cells.values():
        c.intensity = min(1.0, c.intensity / peak)
    return sorted(cells.values(), key=lambda c: c.intensity, reverse=True)


def _latest_risk_by_vessel(db: Session) -> Dict[int, float]:
    latest_ids = db.query(func.max(VesselRiskScore.id)).group_by(VesselRiskScore.vessel_id).scalar_subquery()
    rows = db.query(VesselRiskScore.vessel_id, VesselRiskScore.score).filter(VesselRiskScore.id.in_(latest_ids)).all()
    return {vessel_id: float(score) for vessel_id, score in rows}
