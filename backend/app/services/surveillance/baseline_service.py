"""Keep one behavior profile per vessel and turn deviations from it into surveillance events.

The profile is learned from the vessel's own stored history when enough of it
exists before the current activity window; otherwise the provider-supplied
historical baseline is used. Scenario vessels carry scripted histories.
"""
from datetime import timedelta
from typing import List, Optional, Sequence

from sqlalchemy.orm import Session

from app.config import settings
from app.models.dark_period import DarkPeriod
from app.models.vessel_behavior_profile import VesselBehaviorProfile
from app.services.ais.provider import HistoricalBaseline
from app.services.surveillance.analyzer import EVENT_SCORE_THRESHOLD, DetectedEvent
from app.services.surveillance.baseline import BehaviorProfile, assess_deviation, build_profile, split_track
from app.services.surveillance.features import KinematicPoint
from app.utils_time import utcnow


class BaselineService:
    def __init__(self, db: Session, current_hours: Optional[float] = None, min_history_hours: Optional[float] = None):
        self.db = db
        self.current_hours = settings.BASELINE_CURRENT_HOURS if current_hours is None else current_hours
        self.min_history_hours = settings.BASELINE_MIN_HISTORY_HOURS if min_history_hours is None else min_history_hours

    def profile_for(self, vessel_id: int) -> Optional[VesselBehaviorProfile]:
        return self.db.query(VesselBehaviorProfile).filter_by(vessel_id=vessel_id).first()

    def store_historical(self, vessel_id: int, baseline: HistoricalBaseline) -> VesselBehaviorProfile:
        """Record a provider-supplied baseline unless the vessel already has a profile."""
        row = self.profile_for(vessel_id)
        if row:
            return row
        profile = BehaviorProfile(
            point_count=baseline.point_count, hours_observed=baseline.hours_observed,
            average_speed=baseline.average_speed, speed_stddev=baseline.speed_stddev,
            course_change_rate_deg_per_hour=baseline.course_change_rate_deg_per_hour,
            gap_count=int(round(baseline.gaps_per_hour * baseline.hours_observed)),
            common_cells=list(baseline.common_cells), window_start=None, window_end=None,
        )
        row = VesselBehaviorProfile(vessel_id=vessel_id)
        row.apply(profile, "HISTORICAL")
        self.db.add(row)
        self.db.flush()
        return row

    def detect(self, vessel_id: int, track: Sequence[KinematicPoint],
               dark_periods: Sequence[DarkPeriod]) -> List[DetectedEvent]:
        """Update the vessel's profile and return a BEHAVIOR_DEVIATION event when its current window departs from it."""
        history, current = split_track(track, self.current_hours)
        if not current:
            return []
        cutoff = current[0].timestamp - timedelta(seconds=1)
        history_gaps = sum(1 for d in dark_periods if d.start_time <= cutoff)
        current_gaps = len(dark_periods) - history_gaps

        row = self.profile_for(vessel_id)
        learned = build_profile(history, history_gaps) if self._hours(history) >= self.min_history_hours else None
        if learned:
            row = row or VesselBehaviorProfile(vessel_id=vessel_id)
            row.apply(learned, "LEARNED")
            self.db.add(row)
        if row is None:
            return []

        deviation = assess_deviation(row.as_profile(), current, recent_gaps=current_gaps)
        if deviation is None:
            return []
        row.record_deviation(deviation, utcnow())
        self.db.flush()
        if deviation.score <= EVENT_SCORE_THRESHOLD:
            return []
        return [DetectedEvent(
            "BEHAVIOR_DEVIATION", vessel_id, current[0].timestamp, current[-1].latitude, current[-1].longitude,
            score=float(deviation.score), confidence=0.8,
            payload={
                "explanation": deviation.explanation, "baseline_speed": deviation.baseline_speed,
                "recent_speed": deviation.recent_speed, "speed_z": deviation.speed_z,
                "turning_ratio": deviation.turning_ratio, "new_gaps": deviation.new_gaps,
                "baseline_source": row.source, "window_hours": self.current_hours,
            },
        )]

    @staticmethod
    def _hours(points: Sequence[KinematicPoint]) -> float:
        if len(points) < 2:
            return 0.0
        return (points[-1].timestamp - points[0].timestamp).total_seconds() / 3600.0
