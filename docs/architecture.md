# OceanSentinel Architecture Specification (Phase 1)

## 1. System Vision
OceanSentinel is structured as a multi-agent autonomous maritime intelligence platform. While future phases integrate dark-vessel detection, satellite computer vision, and autonomous cleanup fleets, **Phase 1** solidifies the **Maritime Commander and Shipping Agent** deterministic core.

```
                  ┌───────────────────────────────┐
                  │      Maritime Commander       │
                  │         Orchestrator          │
                  └──────────────┬────────────────┘
                                 │
                                 ▼
                  ┌───────────────────────────────┐
                  │        Shipping Agent         │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Routing Engine  │     │ Hydrodynamic    │     │ Multi-Objective │
│ (Grid & A*)     │     │ Fuel Model      │     │ Scoring & XAI   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 2. Core Service Decomposition

### Maritime Commander / Optimization Service
- Receives route requests with vessel selection, origin, destination, and optimization mode/weights.
- Queries vessel hydrodynamics, cargo configuration, and active constraints.
- Triggers path generation across multiple oceanic corridors.
- Synthesizes candidate metrics and selects the optimal route.
- Produces explainable justifications and transparent operational tradeoffs.

### Routing Engine
- Manages an oceanic 2D grid representation with obstacle exclusion polygons.
- Uses A* graph traversal with 8-directional neighbor expansion (straight cost $1.0$, diagonal cost $\sqrt{2}$).
- Computes great-circle distances via the Haversine equation.
- Generates GeoJSON LineString coordinates format `[longitude, latitude]`.

### Fuel & Emissions Physics Engine
- Models propulsion resistance using a cubic speed power curve:
  $$\text{speed\_factor} = \left(\frac{v}{v_{\text{ref}}}\right)^3$$
- Models cargo draft displacement:
  $$\text{cargo\_factor} = 1 + (0.0005 \times \text{cargo\_tonnes})$$
- Evaluates total consumption and CO₂ emissions ($3.114\text{ kg CO}_2 / \text{L}$).

## 3. Event-Driven Readiness
The architecture defines event models for Phase 2 handoff:
- `ROUTE_OPTIMIZATION_REQUESTED`
- `ROUTE_OPTIMIZATION_COMPLETED`
- `VOYAGE_CREATED`
- `VOYAGE_STARTED`
- `VOYAGE_COMPLETED`
