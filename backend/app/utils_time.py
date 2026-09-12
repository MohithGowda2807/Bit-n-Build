from datetime import datetime, timezone


def utcnow() -> datetime:
    """Naive UTC timestamp, matching how Phase 1 stores datetimes."""
    return datetime.now(timezone.utc).replace(tzinfo=None)
