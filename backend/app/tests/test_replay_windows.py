import time

from app.services.surveillance.replay import dark_window_fractions


def test_dark_windows_are_fractions_of_scenario_duration():
    # AIS_GAP runs 240 minutes with one dark window from minute 90 to 150.
    assert dark_window_fractions("AIS_GAP") == [
        {"mmsi": "419000201", "name": "FV Silent Tide", "start": 0.375, "end": 0.625},
    ]


def test_scenario_without_dark_windows_is_empty():
    assert dark_window_fractions("NORMAL_VESSEL") == []


def test_composite_windows_use_the_longest_script_as_the_span():
    windows = dark_window_fractions("DARK_FISHING_COMPOSITE")  # 290 minutes, dark 140-200
    assert len(windows) == 1
    assert windows[0]["mmsi"] == "419000801"
    assert abs(windows[0]["start"] - 140 / 290) < 1e-6 and abs(windows[0]["end"] - 200 / 290) < 1e-6


def _wait_for_replay(client):
    for _ in range(200):
        if not client.get("/api/v1/simulation/replay/status").json()["running"]:
            return
        time.sleep(0.05)


def test_replay_start_reports_time_span_and_dark_windows(client):
    started = client.post("/api/v1/simulation/replay", json={"scenario": "AIS_GAP", "step_seconds": 0.0}).json()
    _wait_for_replay(client)
    assert started["status"] == "started"
    assert started["dark_windows"] == [{"mmsi": "419000201", "name": "FV Silent Tide", "start": 0.375, "end": 0.625}]
    assert started["start_time"] < started["end_time"]
