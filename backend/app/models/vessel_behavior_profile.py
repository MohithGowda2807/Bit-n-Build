import json
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from app.database import Base
from app.services.surveillance.baseline import BehaviorDeviation, BehaviorProfile
from app.utils_time import utcnow

PROFILE_SOURCES = ("HISTORICAL", "LEARNED")  # supplied by the provider, or built from stored track history


class VesselBehaviorProfile(Base):
    """What a vessel normally does, plus the latest comparison of its current activity against that."""

    __tablename__ = "vessel_behavior_profiles"

    id = Column(Integer, primary_key=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False, unique=True, index=True)
    source = Column(String(12), nullable=False)
    point_count = Column(Integer, nullable=False)
    hours_observed = Column(Float, nullable=False)
    average_speed = Column(Float, nullable=False)
    speed_stddev = Column(Float, nullable=False)
    course_change_rate_deg_per_hour = Column(Float, nullable=False)
    gap_count = Column(Integer, nullable=False, default=0)
    common_cells_json = Column(Text, nullable=False, default="[]")
    window_start = Column(DateTime, nullable=True)
    window_end = Column(DateTime, nullable=True)
    last_deviation_json = Column(Text, nullable=True)
    last_deviation_at = Column(DateTime, nullable=True)
    last_updated = Column(DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    @property
    def common_cells(self) -> list:
        return json.loads(self.common_cells_json or "[]")

    @property
    def last_deviation(self) -> Optional[dict]:
        return json.loads(self.last_deviation_json) if self.last_deviation_json else None

    def apply(self, profile: BehaviorProfile, source: str) -> None:
        self.source = source
        self.point_count = profile.point_count
        self.hours_observed = profile.hours_observed
        self.average_speed = profile.average_speed
        self.speed_stddev = profile.speed_stddev
        self.course_change_rate_deg_per_hour = profile.course_change_rate_deg_per_hour
        self.gap_count = profile.gap_count
        self.common_cells_json = json.dumps(profile.common_cells)
        self.window_start = profile.window_start
        self.window_end = profile.window_end

    def record_deviation(self, deviation: BehaviorDeviation, at) -> None:
        self.last_deviation_json = json.dumps({
            "score": deviation.score, "speed_z": deviation.speed_z, "baseline_speed": deviation.baseline_speed,
            "recent_speed": deviation.recent_speed, "turning_ratio": deviation.turning_ratio,
            "new_gaps": deviation.new_gaps, "explanation": deviation.explanation, "timestamp": at.isoformat(),
        })
        self.last_deviation_at = at

    def as_profile(self) -> BehaviorProfile:
        return BehaviorProfile(
            point_count=self.point_count, hours_observed=self.hours_observed, average_speed=self.average_speed,
            speed_stddev=self.speed_stddev, course_change_rate_deg_per_hour=self.course_change_rate_deg_per_hour,
            gap_count=self.gap_count, common_cells=self.common_cells,
            window_start=self.window_start, window_end=self.window_end,
        )
