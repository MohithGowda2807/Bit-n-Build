from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.data.seed_data import seed_database

Base.metadata.create_all(bind=engine)
db = SessionLocal()
seed_database(db)
db.close()

client = TestClient(app, headers={"X-Role": "ADMIN", "X-User": "test.admin"})


def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["ok", "degraded"]
    assert "database" in data


def test_vessels_list_endpoint():
    response = client.get("/api/v1/vessels")
    assert response.status_code == 200
    vessels = response.json()
    assert len(vessels) >= 10
    assert any(v["name"] == "MV Ocean Star" for v in vessels)


def test_ports_list_endpoint():
    response = client.get("/api/v1/ports")
    assert response.status_code == 200
    ports = response.json()
    assert len(ports) >= 10
    assert any("Singapore" in p["name"] for p in ports)


def test_zones_list_endpoint():
    response = client.get("/api/v1/zones")
    assert response.status_code == 200
    zones = response.json()
    assert len(zones) >= 5


def test_route_optimize_endpoint():
    payload = {
        "vessel_id": 1,
        "origin": {"latitude": 18.9438, "longitude": 72.8364},  # Mumbai
        "destination": {"latitude": 1.29027, "longitude": 103.851959},  # Singapore
        "mode": "fuel_efficient",
        "optimization": {
            "fuel": 0.5,
            "time": 0.2,
            "safety": 0.15,
            "environment": 0.15
        }
    }
    response = client.post("/api/v1/routes/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "recommended_route" in data
    assert "alternatives" in data
    assert "comparison" in data
    assert "explanation" in data

    rec = data["recommended_route"]
    assert rec["distance_km"] > 0
    assert rec["estimated_fuel_liters"] > 0
    assert rec["estimated_time_hours"] > 0
    assert rec["geometry"]["type"] == "LineString"
    assert len(rec["geometry"]["coordinates"]) >= 2


def test_invalid_coordinates_rejected():
    payload = {
        "vessel_id": 1,
        "origin": {"latitude": 120.0, "longitude": 72.0},  # Invalid latitude > 90
        "destination": {"latitude": 1.0, "longitude": 103.0}
    }
    response = client.post("/api/v1/routes/optimize", json=payload)
    assert response.status_code == 422
