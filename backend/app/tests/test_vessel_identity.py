from app.models.vessel import Vessel


def test_vessel_keeps_mmsi_and_imo_as_separate_identifiers():
    vessel = Vessel(
        vessel_identifier="FV-TEST-1",
        name="Test Trawler",
        vessel_type="FISHING",
        mmsi="419001234",
        imo_number="9876543",
        callsign="VTAB",
        flag="IN",
    )
    assert vessel.mmsi == "419001234"
    assert vessel.imo_number == "9876543"
    assert vessel.mmsi != vessel.imo_number
    assert vessel.callsign == "VTAB"
    assert vessel.flag == "IN"


def test_vessel_api_exposes_identity_fields():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    response = client.get("/api/v1/vessels")
    assert response.status_code == 200
    first = response.json()[0]
    for field in ("mmsi", "imo_number", "callsign", "flag"):
        assert field in first
