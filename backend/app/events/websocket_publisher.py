"""Event publisher that also pushes every event to the TRITON WebSocket telemetry hub.

Publishers are called from synchronous request handlers, which run in worker
threads, so broadcasts are scheduled onto the application's event loop.
Without a loop (tests, scripts) events are only recorded.
"""
import asyncio
import logging
from typing import List, Optional

from app.events.publisher import Event, InMemoryEventPublisher

logger = logging.getLogger("oceansentinel.events")
WS_EVENT_TYPE = "surveillance_event"


class WebSocketEventPublisher:
    def __init__(self, hub, loop: Optional[asyncio.AbstractEventLoop]):
        self._hub = hub
        self._loop = loop
        self._history = InMemoryEventPublisher()

    def publish(self, event: Event) -> None:
        self._history.publish(event)
        if self._loop is None or self._loop.is_closed():
            return
        try:
            asyncio.run_coroutine_threadsafe(self._hub.broadcast(WS_EVENT_TYPE, event.as_dict()), self._loop)
        except RuntimeError as exc:  # loop shut down between check and schedule
            logger.debug("WebSocket broadcast skipped: %s", exc)

    def subscribe(self, callback) -> None:
        self._history.subscribe(callback)

    def recent(self, limit: int = 50) -> List[Event]:
        return self._history.recent(limit)
