"""Live AIS provider (aisstream.io) behind the same interface as the simulation."""
from datetime import datetime, timezone

import pytest

from app.services.ais.aisstream import AISStreamProvider, vessel_type_from_ais_code
from app.services.ais.factory import ProviderNotConfigured, build_provider

POSITION = {
    "MessageType": "PositionReport",
    "MetaData": {"MMSI": 419000999, "ShipName": "FV TEST BOAT ", "latitude": 12.5, "longitude": 72.5,
                 "time_utc": "2026-09-13 06:15:20.123456789 +0000 UTC"},
    "Message": {"PositionReport": {"Sog": 7.4, "Cog": 123.5, "TrueHeading": 120, "NavigationalStatus": 7}},
}
STATIC = {
    "MessageType": "ShipStaticData",
    "MetaData": {"MMSI": 419000999, "ShipName": "FV TEST BOAT", "latitude": 12.5, "longitude": 72.5,
                 "time_utc": "2026-09-13 06:15:21 +0000 UTC"},
    "Message": {"ShipStaticData": {"Type": 30, "CallSign": "VTB1", "ImoNumber": 1234567, "Name": "FV TEST BOAT"}},
}
OTHER = {
    "MessageType": "PositionReport",
    "MetaData": {"MMSI": 353000111, "ShipName": "MV BOX", "latitude": 13.1, "longitude": 71.9,
                 "time_utc": "2026-09-13 06:16:00 +0000 UTC"},
    "Message": {"PositionReport": {"Sog": 12.0, "Cog": 270.0, "TrueHeading": 511, "NavigationalStatus": 0}},
}


def test_messages_become_normalised_reports_and_vessels():
    provider = AISStreamProvider(api_key="k", bounding_box=(10.0, 68.0, 16.0, 76.0), collect_seconds=1,
                                 messages=[POSITION, STATIC, OTHER])
    reports = provider.get_positions()
    assert [r.mmsi for r in reports] == ["419000999", "353000111"]
    first = reports[0]
    assert (first.latitude, first.longitude, first.speed_over_ground, first.course_over_ground) == (12.5, 72.5, 7.4, 123.5)
    assert first.heading == 120 and first.source == "AISSTREAM"
    assert first.timestamp == datetime(2026, 9, 13, 6, 15, 20, 123456, tzinfo=timezone.utc)
    assert reports[1].heading is None  # 511 means heading not available
    vessels = {v.mmsi: v for v in provider.get_vessels()}
    assert vessels["419000999"].name == "FV TEST BOAT" and vessels["419000999"].vessel_type == "FISHING"
    assert vessels["419000999"].callsign == "VTB1" and vessels["419000999"].imo_number == "1234567"
    assert vessels["353000111"].vessel_type == "UNKNOWN"  # no static data seen for it
    assert provider.get_vessel("nope") is None
    assert provider.get_track("419000999", datetime(2026, 9, 13, tzinfo=timezone.utc), datetime(2026, 9, 14, tzinfo=timezone.utc)) == [first]


@pytest.mark.parametrize("code,expected", [(30, "FISHING"), (70, "CARGO"), (79, "CARGO"), (80, "TANKER"), (36, "SAILING"), (0, "UNKNOWN")])
def test_ais_ship_type_codes_map_to_vessel_types(code, expected):
    assert vessel_type_from_ais_code(code) == expected


def test_factory_defaults_to_simulation_and_refuses_live_without_a_key(monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "AIS_PROVIDER", "simulation")
    assert type(build_provider()).__name__ == "SimulationAISProvider"
    monkeypatch.setattr(settings, "AIS_PROVIDER", "aisstream")
    monkeypatch.setattr(settings, "AISSTREAM_API_KEY", "")
    with pytest.raises(ProviderNotConfigured):
        build_provider()


def test_ingest_endpoint_runs_the_configured_provider(client, monkeypatch):
    from app.api import ais as ais_api
    provider = AISStreamProvider(api_key="k", bounding_box=(10.0, 68.0, 16.0, 76.0), collect_seconds=1,
                                 messages=[POSITION, STATIC, OTHER])
    monkeypatch.setattr(ais_api, "build_provider", lambda: provider)
    response = client.post("/api/v1/ais/ingest")
    assert response.status_code == 200, response.text
    body = response.json()
    assert body["provider"] == "AISStreamProvider" and body["positions_added"] == 2
    assert client.get("/api/v1/vessels", params={"mmsi": "419000999"}).json()[0]["name"] == "FV TEST BOAT"
    assert client.post("/api/v1/ais/ingest", headers={"X-Role": "OPERATOR"}).status_code == 403


def test_provider_status_reports_configuration(client):
    status = client.get("/api/v1/ais/provider").json()
    assert status["provider"] == "simulation" and status["configured"] is True
