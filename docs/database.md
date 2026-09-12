# Database Schema & Data Dictionary

The OceanSentinel Phase 1 data layer is managed with SQLAlchemy / PostGIS.

## Entity-Relationship Diagram

```
┌────────────────┐          ┌────────────────┐          ┌────────────────┐
│     Vessel     │ 1      * │     Voyage     │ *      1 │     Route      │
├────────────────┼──────────┼────────────────┼──────────┼────────────────┤
│ id (PK)        │          │ id (PK)        │          │ id (PK)        │
│ identifier     │          │ vessel_id (FK) │          │ origin_lat     │
│ name           │          │ route_id (FK)  │          │ origin_lon     │
│ vessel_type    │          │ status         │          │ dest_lat       │
│ cruise_speed   │          │ departure_time │          │ dest_lon       │
│ fuel_rate      │          │ estimated_arr  │          │ distance_km    │
│ cargo_capacity │          │ starting_fuel  │          │ est_fuel_l     │
│ current_fuel   │          │ fuel_saved     │          │ est_co2_kg     │
│ latitude       │          │ co2_estimated  │          │ est_cost       │
│ longitude      │          └────────────────┘          │ geometry (JSON)│
│ status         │                                      └───────┬────────┘
└────────────────┘                                              │ 1
                                                                │ *
┌────────────────┐          ┌────────────────┐          ┌───────┴────────┐
│      Port      │          │   MarineZone   │          │  RouteSegment  │
├────────────────┼──────────┼────────────────┼──────────┼────────────────┤
│ id (PK)        │          │ id (PK)        │          │ id (PK)        │
│ name           │          │ name           │          │ route_id (FK)  │
│ country        │          │ zone_type      │          │ seq_number     │
│ latitude       │          │ geometry (JSON)│          │ start_pt       │
│ longitude      │          │ risk_level     │          │ end_pt         │
│ congestion     │          │ restricted     │          │ distance_km    │
│ capacity       │          │ description    │          │ speed_knots    │
└────────────────┘          └────────────────┘          └────────────────┘
```

## Tables & Fields

1. **`vessels`**: Stores managed commercial and specialized ships with propulsion specs and telemetry coordinates.
2. **`ports`**: Commercial ports and terminals with geographic coordinates, capacity berths, and congestion metrics.
3. **`marine_zones`**: Geospatial boundaries of maritime zones (traffic corridors, whale sanctuaries, hazard zones, environmental reserves).
4. **`routes`**: Historical and optimized voyage routes containing GeoJSON geometry, distance, fuel, emissions, and risk indices.
5. **`route_segments`**: Granular waypoints and segments along planned paths for fine-grained navigation analysis.
6. **`voyages`**: Real-time voyage tracking instances linking assigned vessels to routes with execution progress.
