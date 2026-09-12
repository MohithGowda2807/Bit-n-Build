"""Minimal event publishing seam.

Phase 3 publishes surveillance events through this interface. Phase 2 owns the
Redis event bus; when it lands, a Redis-backed publisher replaces the in-memory
default via `set_publisher` without touching the pipeline or risk service.
"""
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Callable, Deque, Dict, List, Optional, Protocol

from app.utils_time import utcnow


@dataclass
class Event:
    event_type: str
    source: str
    vessel_id: Optional[int] = None
    payload: Dict[str, Any] = field(default_factory=dict)
    timestamp: datetime = field(default_factory=utcnow)

    def as_dict(self) -> Dict[str, Any]:
        return {
            "event_type": self.event_type,
            "source": self.source,
            "timestamp": self.timestamp.isoformat(),
            "vessel_id": self.vessel_id,
            "payload": self.payload,
        }


class EventPublisher(Protocol):
    def publish(self, event: Event) -> None: ...


class InMemoryEventPublisher:
    def __init__(self, max_events: int = 1000):
        self._events: Deque[Event] = deque(maxlen=max_events)
        self._subscribers: List[Callable[[Event], None]] = []

    def subscribe(self, callback: Callable[[Event], None]) -> None:
        self._subscribers.append(callback)

    def publish(self, event: Event) -> None:
        self._events.append(event)
        for callback in self._subscribers:
            callback(event)

    def recent(self, limit: int = 50) -> List[Event]:
        return list(reversed(self._events))[:limit]


_publisher: EventPublisher = InMemoryEventPublisher()


def get_publisher() -> EventPublisher:
    return _publisher


def set_publisher(publisher: EventPublisher) -> None:
    global _publisher
    _publisher = publisher
