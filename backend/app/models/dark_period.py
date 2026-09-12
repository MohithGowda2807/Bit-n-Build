from app.utils_time import utcnow
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.database import Base
from app.services.surveillance.ais_gap import AISGap

# Severity by silence duration alone; contextual risk is scored separately.
SEVERITY_THRESHOLDS_SECONDS = (
    ("CRITICAL", 6 * 3600),
    ("HIGH", 2 * 3600),
    ("MODERATE", 1 * 3600),
)


def severity_for(duration_seconds: float) -> str:
    for label, floor in SEVERITY_THRESHOLDS_SECONDS:
        if duration_seconds >= floor:
            return label
    return "LOW"


class DarkPeriod(Base):
    """A detected AIS silence for one vessel."""

    __tablename__ = "dark_periods"

    id = Column(Integer, primary_key=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, index=True)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=True)  # NULL while still dark
    duration_seconds = Column(Float, nullable=False)
    last_latitude = Column(Float, nullable=False)
    last_longitude = Column(Float, nullable=False)
    reappearance_latitude = Column(Float, nullable=True)
    reappearance_longitude = Column(Float, nullable=True)
    estimated_distance_km = Column(Float, nullable=True)
    severity = Column(String(10), nullable=False)
    created_at = Column(DateTime, nullable=False, default=utcnow)

    @classmethod
    def from_gap(cls, vessel_id: int, gap: AISGap) -> "DarkPeriod":
        return cls(
            vessel_id=vessel_id,
            start_time=gap.start_time,
            end_time=gap.end_time,
            duration_seconds=gap.duration_seconds,
            last_latitude=gap.last_latitude,
            last_longitude=gap.last_longitude,
            reappearance_latitude=gap.reappearance_latitude,
            reappearance_longitude=gap.reappearance_longitude,
            estimated_distance_km=gap.estimated_distance_km,
            severity=severity_for(gap.duration_seconds),
        )
