# OceanSentinel API Reference (Phase 1)

Base URL: `http://localhost:8000`
Interactive Swagger Docs: `http://localhost:8000/docs`

---

## 1. System Health

### `GET /health`
Returns health check of database and Redis services.
```json
{
  "status": "ok",
  "database": "healthy",
  "redis": "healthy"
}
```

---

## 2. Route Optimization

### `POST /api/v1/routes/optimize`
Calculates multi-objective maritime routes avoiding landmass obstacles.

**Request Body:**
```json
{
  "vessel_id": 1,
  "origin": { "latitude": 18.9438, "longitude": 72.8364 },
  "destination": { "latitude": 1.29027, "longitude": 103.851959 },
  "mode": "fuel_efficient",
  "optimization": {
    "fuel": 0.55,
    "time": 0.15,
    "safety": 0.15,
    "environment": 0.15
  }
}
```

**Response Body:**
```json
{
  "recommended_route": {
    "id": 1,
    "name": "Fuel-Efficient Route",
    "optimization_mode": "fuel_efficient",
    "distance_km": 3920.4,
    "estimated_time_hours": 172.5,
    "estimated_fuel_liters": 28400.0,
    "estimated_co2_kg": 88437.6,
    "estimated_cost": 24140.0,
    "risk_score": 25.0,
    "environmental_score": 60.0,
    "optimization_score": 88.5,
    "fuel_saved_liters": 4200.0,
    "co2_avoided_kg": 13078.8,
    "eta": "2026-09-19T16:30:00Z",
    "geometry": {
      "type": "LineString",
      "coordinates": [[72.8364, 18.9438], [103.8519, 1.2902]]
    }
  },
  "alternatives": [...],
  "comparison": [...],
  "explanation": {
    "recommendation": "Fuel-Efficient Route",
    "reasons": [
      "12.8% lower estimated fuel consumption (4,200 L saved)",
      "12.8% lower estimated CO2 emissions (13,079 kg avoided)"
    ],
    "tradeoffs": [
      "+14.2 hours travel time compared with fastest route"
    ]
  }
}
```

---

## 3. Fleet & Ports

- `GET /api/v1/vessels`: List all active fleet vessels.
- `GET /api/v1/vessels/{id}`: Retrieve vessel telemetry and propulsion specifications.
- `GET /api/v1/ports`: List global commercial ports.
- `GET /api/v1/ports/nearest?latitude=X&longitude=Y`: Retrieve nearest port to coordinates.
- `GET /api/v1/zones`: List marine zones (traffic lanes, sanctuaries, risk zones).
- `GET /api/v1/analytics/summary`: Aggregate voyage, fuel, and sustainability metrics.

## Authentication and roles

Roles are VIEWER < ANALYST < OPERATOR < ADMIN. Send `Authorization: Bearer <token>` from `POST /api/v1/auth/login`, or, while `AUTH_ALLOW_ROLE_HEADER` is true, the `X-Role` and `X-User` headers. Every write route carries a minimum role and answers 403 with code `FORBIDDEN` below it; the table of what each role unlocks is in [surveillance.md](./surveillance.md#access-control).
