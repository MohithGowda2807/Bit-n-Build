import asyncio
import threading

from app.events.publisher import Event
from app.events.websocket_publisher import WebSocketEventPublisher


class FakeHub:
    def __init__(self):
        self.messages = []

    async def broadcast(self, event_type, data):
        self.messages.append((event_type, data))


def _background_loop():
    loop = asyncio.new_event_loop()
    threading.Thread(target=loop.run_forever, daemon=True).start()
    return loop


def test_publish_broadcasts_to_hub_and_keeps_recent_history():
    hub = FakeHub()
    loop = _background_loop()
    publisher = WebSocketEventPublisher(hub, loop)
    publisher.publish(Event(event_type="CASE_CREATED", source="risk_engine", vessel_id=11, payload={"case_id": 1}))
    for _ in range(50):
        if hub.messages:
            break
        import time; time.sleep(0.02)
    assert hub.messages[0][0] == "surveillance_event"
    assert hub.messages[0][1]["event_type"] == "CASE_CREATED"
    assert hub.messages[0][1]["vessel_id"] == 11
    assert publisher.recent()[0].event_type == "CASE_CREATED"
    loop.call_soon_threadsafe(loop.stop)


def test_publish_without_a_loop_still_records_history():
    publisher = WebSocketEventPublisher(FakeHub(), loop=None)
    publisher.publish(Event(event_type="AIS_GAP_DETECTED", source="pipeline", vessel_id=3))
    assert [e.event_type for e in publisher.recent()] == ["AIS_GAP_DETECTED"]


def test_surveillance_events_reach_websocket_clients(client):
    with client.websocket_connect("/ws/telemetry") as ws:
        assert ws.receive_json()["type"] == "connection_established"
        client.post("/api/v1/simulation/run", json={"scenario": "DARK_FISHING_COMPOSITE"})
        seen = set()
        for _ in range(60):
            message = ws.receive_json()
            if message.get("type") == "surveillance_event":
                seen.add(message["data"]["event_type"])
            if "CASE_CREATED" in seen:
                break
        assert {"AIS_GAP_DETECTED", "HIGH_RISK_VESSEL", "CASE_CREATED"} <= seen
