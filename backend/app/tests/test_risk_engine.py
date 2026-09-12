from datetime import datetime, timezone

from app.services.surveillance.analyzer import DetectedEvent
from app.services.surveillance.risk import assess_risk

T0 = datetime(2026, 9, 12, 10, 0, tzinfo=timezone.utc)


def gap(minutes):
    return DetectedEvent("AIS_GAP_DETECTED", 1, T0, 12.0, 72.0, confidence=0.99,
                         payload={"duration_seconds": minutes * 60})


def zone_entry(zone_type, kind="FISHING_ZONE", dwell=None):
    payload = {"zone_type": zone_type}
    entry = DetectedEvent("ZONE_ENTRY", 1, T0, 12.0, 72.0, zone_kind=kind, zone_name="Z", payload=payload)
    if dwell is None:
        return [entry]
    exit_ = DetectedEvent("ZONE_EXIT", 1, T0, 12.0, 72.0, zone_kind=kind, zone_name="Z",
                          payload={"zone_type": zone_type, "dwell_seconds": dwell})
    return [entry, exit_]


def fishing(score):
    return DetectedEvent("FISHING_PATTERN", 1, T0, 12.0, 72.0, score=score, confidence=0.75)


def rendezvous(kind, confidence=0.72):
    return DetectedEvent("VESSEL_RENDEZVOUS", 1, T0, 12.0, 72.0, confidence=confidence,
                         other_vessel_id=2, payload={"interaction_type": kind})


def test_no_events_means_zero_risk():
    result = assess_risk("FISHING", [])
    assert result.score == 0
    assert result.level == "LOW"
    assert result.factors == []


def test_long_gap_alone_is_only_moderate():
    result = assess_risk("CARGO", [gap(120)])
    assert 20 < result.score <= 40
    assert result.level == "MODERATE"
    assert [f.factor_type for f in result.factors] == ["AIS_GAP"]


def test_spec_composite_scenario_is_critical_and_explained():
    events = [gap(48)] + zone_entry("NO_FISHING", dwell=2 * 3600) + [fishing(75), rendezvous("POSSIBLE_TRANSSHIPMENT")]
    result = assess_risk("FISHING", events)
    assert result.score > 80
    assert result.level == "CRITICAL"
    types = [f.factor_type for f in result.factors]
    assert set(types) == {"AIS_GAP", "ZONE_ACTIVITY", "FISHING_BEHAVIOR", "RENDEZVOUS"}
    assert [f.score for f in result.factors] == sorted((f.score for f in result.factors), reverse=True)
    assert all(f.explanation for f in result.factors)


def test_false_positive_gap_in_authorized_grounds_stays_low_or_moderate():
    result = assess_risk("FISHING", [gap(40)] + zone_entry("AUTHORIZED_FISHING"))
    assert result.score <= 40
    assert result.level in ("LOW", "MODERATE")


def test_fishing_in_authorized_zone_scores_less_than_in_closed_zone():
    legal = assess_risk("FISHING", zone_entry("AUTHORIZED_FISHING") + [fishing(80)])
    illegal = assess_risk("FISHING", zone_entry("NO_TAKE", kind="MARINE_PROTECTED_AREA") + [fishing(80)])
    assert legal.score < illegal.score
    assert illegal.level in ("HIGH", "CRITICAL")


def test_score_never_exceeds_100():
    events = [gap(600)] + zone_entry("NO_TAKE", kind="MARINE_PROTECTED_AREA", dwell=5 * 3600) + [fishing(100), rendezvous("POSSIBLE_TRANSSHIPMENT", 1.0)]
    assert assess_risk("FISHING", events).score == 100
