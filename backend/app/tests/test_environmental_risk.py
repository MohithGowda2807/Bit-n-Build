import json
from app.services.debris.environmental_risk import (
    point_in_polygon,
    evaluate_debris_environmental_risk
)


def test_point_in_polygon():
    # Square around (10, 72)
    poly = [[71.0, 9.0], [73.0, 9.0], [73.0, 11.0], [71.0, 11.0], [71.0, 9.0]]
    assert point_in_polygon(72.0, 10.0, poly) is True
    assert point_in_polygon(75.0, 10.0, poly) is False


def test_evaluate_debris_environmental_risk():
    # Lakshadweep Sanctuary boundary box approx [71.5 to 73.0 lon, 9.5 to 11.5 lat]
    mpa_geojson = json.dumps({
        "type": "Polygon",
        "coordinates": [[[71.5, 9.5], [73.0, 9.5], [73.0, 11.5], [71.5, 11.5], [71.5, 9.5]]]
    })
    mpas = [{"name": "Lakshadweep Coral Reserve", "geometry_geojson": mpa_geojson}]

    # Case A: Debris drifting towards and entering the MPA
    trajectory = [
        {"hour": 0, "latitude": 10.0, "longitude": 71.0, "current_speed_knots": 1.5, "wind_speed_knots": 15.0},
        {"hour": 4, "latitude": 10.0, "longitude": 71.3, "current_speed_knots": 1.5, "wind_speed_knots": 15.0},
        {"hour": 8, "latitude": 10.0, "longitude": 71.8, "current_speed_knots": 1.5, "wind_speed_knots": 15.0}  # Enters MPA!
    ]

    result = evaluate_debris_environmental_risk(
        debris_lat=10.0,
        debris_lon=71.0,
        debris_type="ghost_net",
        estimated_mass_kg=1200.0,
        trajectory=trajectory,
        mpas=mpas
    )

    assert result["crosses_mpa"] is True
    assert result["threatened_mpa"] == "Lakshadweep Coral Reserve"
    assert result["hours_to_mpa_entry"] == 8
    assert result["priority"] == "urgent"
    assert result["environmental_risk_score"] >= 80.0
    assert "URGENT" in result["narrative"]
