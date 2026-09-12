"""Composite maritime risk score (spec sections 34, 35, 54, 66).

Every point of risk is tied to a factor with an explanation and the event ids
behind it. The output is a suspicion indicator for human review, not a verdict.
"""
from dataclasses import dataclass, field
from typing import Iterable, List, Optional, Sequence

from app.services.surveillance.levels import clamp, level_for

MAX_AIS_GAP = 28.0
MAX_ZONE_ACTIVITY = 30.0
MAX_FISHING_BEHAVIOR = 35.0
MAX_RENDEZVOUS = 15.0
MAX_PLAIN_RENDEZVOUS = 8.0

GAP_FULL_SCORE_HOURS = 3.0
ZONE_DWELL_BONUS_SECONDS = 3600
PROHIBITED_ZONE_TYPES = {"NO_FISHING", "NO_TAKE"}
RESTRICTED_ZONE_TYPES = {"RESTRICTED_FISHING", "SEASONAL_FISHING", "RESTRICTED"}
AUTHORIZED_ZONE_TYPES = {"AUTHORIZED_FISHING"}
PROHIBITED_FISHING_MULTIPLIER = 1.25
LEGAL_FISHING_DISCOUNT = 0.4
BEHAVIOR_EVENT_THRESHOLD = 40


@dataclass(frozen=True)
class RiskFactor:
    factor_type: str  # AIS_GAP, ZONE_ACTIVITY, FISHING_BEHAVIOR, RENDEZVOUS
    score: int
    explanation: str
    event_ids: List[int] = field(default_factory=list)


@dataclass(frozen=True)
class RiskAssessment:
    score: int
    level: str
    factors: List[RiskFactor]


def _ids(events: Iterable) -> List[int]:
    return [e.id for e in events if getattr(e, "id", None) is not None]


def _of_type(events: Sequence, event_type: str) -> List:
    return [e for e in events if e.event_type == event_type]


def _zone_type(event) -> Optional[str]:
    return (event.payload or {}).get("zone_type")


def _minutes(seconds: float) -> int:
    return int(round(seconds / 60.0))


def _behavior_events(events: Sequence) -> List:
    return [e for e in _of_type(events, "FISHING_PATTERN") + _of_type(events, "LOITERING")
            if (e.score or 0) > BEHAVIOR_EVENT_THRESHOLD]


def _entered_zone_types(events: Sequence) -> set:
    return {_zone_type(e) for e in _of_type(events, "ZONE_ENTRY")}


def _ais_gap_factor(events: Sequence) -> Optional[RiskFactor]:
    gaps = _of_type(events, "AIS_GAP_DETECTED")
    if not gaps:
        return None
    longest = max(gaps, key=lambda e: e.payload.get("duration_seconds", 0))
    seconds = longest.payload.get("duration_seconds", 0)
    score = round(MAX_AIS_GAP * clamp(0.5 + seconds / 3600.0 / GAP_FULL_SCORE_HOURS))
    label = "AIS gap" if len(gaps) == 1 else f"{len(gaps)} AIS gaps, longest"
    return RiskFactor("AIS_GAP", score, f"{label}: {_minutes(seconds)} minutes without AIS", _ids(gaps))


def _zone_factor(events: Sequence) -> Optional[RiskFactor]:
    entries = _of_type(events, "ZONE_ENTRY")
    exits = _of_type(events, "ZONE_EXIT")
    fishing_like = bool(_behavior_events(events))
    best: Optional[RiskFactor] = None
    for entry in entries:
        zone_type = _zone_type(entry)
        if zone_type in PROHIBITED_ZONE_TYPES:
            base, wording = 25.0, "entered prohibited zone"
        elif zone_type in RESTRICTED_ZONE_TYPES:
            base, wording = 15.0, "entered restricted zone"
        else:
            continue
        related = [entry] + [x for x in exits if x.zone_name == entry.zone_name]
        dwell = max((x.payload.get("dwell_seconds", 0) for x in related), default=0)
        if dwell >= ZONE_DWELL_BONUS_SECONDS:
            base += 5.0
            wording += f", stayed {_minutes(dwell)} minutes"
        if fishing_like:
            base += 5.0
            wording += ", with fishing-like behavior"
        score = round(min(base, MAX_ZONE_ACTIVITY))
        if best is None or score > best.score:
            best = RiskFactor("ZONE_ACTIVITY", score, f"Vessel {wording} ({entry.zone_name}, {zone_type})", _ids(related))
    return best


def _fishing_factor(events: Sequence) -> Optional[RiskFactor]:
    fishing = _of_type(events, "FISHING_PATTERN")
    loitering = _of_type(events, "LOITERING")
    if not fishing and not loitering:
        return None
    fishing_score = max((e.score or 0) for e in fishing) if fishing else 0
    loiter_score = max((e.score or 0) for e in loitering) if loitering else 0
    raw = max(MAX_FISHING_BEHAVIOR * fishing_score / 100.0, 15.0 * loiter_score / 100.0)
    wording = "Fishing-like movement" if fishing_score >= loiter_score else "Loitering"

    zone_types = _entered_zone_types(events)
    if zone_types & PROHIBITED_ZONE_TYPES:
        raw = min(raw * PROHIBITED_FISHING_MULTIPLIER, MAX_FISHING_BEHAVIOR)
        wording += " inside a prohibited zone"
    elif zone_types and zone_types <= AUTHORIZED_ZONE_TYPES:
        raw *= LEGAL_FISHING_DISCOUNT
        wording += " inside authorized fishing grounds"
    detail = f"{wording} (score {max(fishing_score, loiter_score):.0f}/100)"
    return RiskFactor("FISHING_BEHAVIOR", round(raw), detail, _ids(fishing + loitering))


def _rendezvous_factor(events: Sequence) -> Optional[RiskFactor]:
    meetings = _of_type(events, "VESSEL_RENDEZVOUS")
    if not meetings:
        return None

    def weight(e) -> float:
        transshipment = e.payload.get("interaction_type") == "POSSIBLE_TRANSSHIPMENT"
        cap = MAX_RENDEZVOUS if transshipment else MAX_PLAIN_RENDEZVOUS
        return cap * clamp(0.5 + (e.confidence or 0.5) / 2.0)

    strongest = max(meetings, key=weight)
    kind = strongest.payload.get("interaction_type", "RENDEZVOUS").replace("_", " ").lower()
    explanation = f"Vessel met another vessel at sea ({kind}, confidence {strongest.confidence:.2f})"
    return RiskFactor("RENDEZVOUS", round(weight(strongest)), explanation, _ids(meetings))


def assess_risk(vessel_type: str, events: Sequence) -> RiskAssessment:
    factors = [
        f for f in (
            _ais_gap_factor(events),
            _zone_factor(events),
            _fishing_factor(events),
            _rendezvous_factor(events),
        )
        if f is not None and f.score > 0
    ]
    factors.sort(key=lambda f: f.score, reverse=True)
    score = int(min(100, sum(f.score for f in factors)))
    return RiskAssessment(score=score, level=level_for(score), factors=factors)
