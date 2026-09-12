# Phase 4: Command Center + Demo & Unified Autonomy — Task Breakdown

This document provides a dependency-aware, step-by-step breakdown of coding tasks for Phase 4 of **TRITON / OceanSentinel**. Each task is designed to be executed sequentially or independently by coding agents.

Branch: `feature/phase-4-command-center-demo`

---

## Dependency Graph

```
[Phase 4A: Core Backend Data & Physics]
  Task 1.1: Extended Debris & Fleet Models
      │
      ├───► Task 1.2: Debris Drift & Ocean Current Physics Engine
      │         │
      │         └───► Task 1.3: Environmental Risk & MPA Interaction Engine
      │
      └───► Task 1.4: Autonomous Cleanup Fleet Model & Energy/Payload Simulator
                │
                └───► Task 1.5: Mission Planner & Multi-Target VRP Optimization Engine

[Phase 4B: Agents & Multi-Agent Orchestration]
  Tasks 1.2, 1.3, 1.5
      │
      └───► Task 2.1: Marine Preservation Agent & Cleanup Tools (CrewAI/Toolkit)
                │
                └───► Task 2.2: Unified Maritime Commander Tri-Domain Integration & Trace

[Phase 4C: API Gateway, WebSocket & Scenarios]
  Tasks 2.1, 2.2
      │
      ├───► Task 3.1: REST Endpoints for Fleet, Missions, Drift Forecast, and Impact Metrics
      ├───► Task 3.2: Real-time Telemetry & WebSocket Event Broadcasting
      └───► Task 3.3: Rich Seed Dataset & 3 Turnkey Demo Scenarios

[Phase 4D: Frontend Command Center & UI Components]
  Tasks 3.1, 3.2, 3.3
      │
      ├───► Task 4.1: Unified Ocean Map Multi-Layer Overlays (Vessels, Zones, Debris, Drift, Missions)
      ├───► Task 4.2: Autonomous Debris & Cleanup Fleet Mission Studio
      ├───► Task 4.3: Ask TRITON Agent Console with Visual Trace & Explainability
      ├───► Task 4.4: Human-in-the-Loop Approval Flow & Incident/Mission Report Modal
      └───► Task 4.5: Global Impact & Sustainability Metrics HUD + Demo Scenario Quick-Switcher

[Phase 4E: Verification, Polish, Documentation]
  Tasks 4.1-4.5
      │
      ├───► Task 5.1: Backend & Frontend End-to-End Test Suite & Synthetic Fallbacks
      └───► Task 5.2: Final Architecture Documentation & Hackathon README Polish
```

---

## Task Details

### Task 1.1: Extended Debris & Cleanup Fleet Data Schemas
- **Target Files**:
  - `backend/app/models/debris.py`
  - `backend/app/models/cleanup_unit.py` (new)
  - `backend/app/models/mission.py`
  - `backend/app/schemas/debris.py`
  - `backend/app/schemas/cleanup_unit.py` (new)
  - `backend/app/schemas/mission.py`
  - `backend/app/models/__init__.py`
- **Dependencies**: None.
- **Steps**:
  1. Extend `Debris` model with `cluster_id`, `estimated_mass_kg`, `estimated_volume_m3`, `confidence`, `drift_heading_deg`, `drift_speed_knots`, `target_species_threatened`.
  2. Implement `CleanupUnit` model with `unit_name`, `unit_type` (`asv_skimmer`, `autonomous_drone`, `towed_boom`), `latitude`, `longitude`, `speed_knots`, `battery_pct`, `max_range_nm`, `capacity_kg`, `current_load_kg`, `status` (`idle`, `transit`, `collecting`, `returning`, `docked`, `maintenance`), `assigned_mission_id`.
  3. Extend `Mission` model with `origin_lat`, `origin_lon`, `waypoints_json`, `target_debris_ids`, `estimated_duration_hours`, `estimated_energy_kwh`, `collected_kg`, `assigned_unit_id`, `approval_status`.
  4. Create matching Pydantic schemas in `app/schemas/`.
- **Verification**: Run schema test confirming SQLite initialization.

---

### Task 1.2: Debris Drift & Ocean Current Physics Engine
- **Target Files**:
  - `backend/app/services/debris/drift.py` (new)
  - `backend/app/services/debris/clustering.py` (new)
  - `backend/app/services/debris/__init__.py` (new)
- **Dependencies**: Task 1.1
- **Steps**:
  1. Implement drift physics $\vec{v}_{drift} = \alpha \vec{v}_{current} + \beta \vec{v}_{wind}$ ($\alpha=1.0, \beta=0.03$).
  2. Implement `predict_debris_drift(lat, lon, hours, current_vec, wind_vec)` generating hourly trajectory coordinates.
  3. Implement `cluster_debris_points(points, eps_km=25.0, min_samples=2)` grouping sightings into cohesive patches.
- **Verification**: Unit tests for drift trajectory vectors and spatial clustering.

---

### Task 1.3: Environmental Risk & MPA Interaction Engine
- **Target Files**:
  - `backend/app/services/debris/environmental_risk.py` (new)
- **Dependencies**: Task 1.1, Task 1.2
- **Steps**:
  1. Calculate minimum distance to nearest Marine Protected Area (MPA) and sensitive coral reef / sanctuary.
  2. Predict trajectory intersection with MPA boundaries within 24–48 hours.
  3. Evaluate hazard to shipping lanes (navigation collision hazard).
  4. Compute normalized 0–100 risk score and generate explainable text narrative.
- **Verification**: Unit tests for MPA intersection detection and penalty scoring.

---

### Task 1.4: Autonomous Cleanup Fleet Model & Energy/Payload Simulator
- **Target Files**:
  - `backend/app/services/debris/fleet_simulator.py` (new)
- **Dependencies**: Task 1.1
- **Steps**:
  1. Implement `FleetSimulator` for ASVs/drones: power consumption = hotel load + propulsion ($v^2$) + collection gear work.
  2. Implement payload increment as debris is collected; trigger return-to-base on $>90\%$ payload or $<25\%$ battery.
  3. Implement `simulate_fleet_step(dt_seconds)` advancing units toward next mission waypoint.
- **Verification**: Unit tests verifying battery discharge curve, capacity triggers, and waypoint stepping.

---

### Task 1.5: Mission Planner & Multi-Target VRP Optimization Engine
- **Target Files**:
  - `backend/app/services/debris/mission_planner.py` (new)
- **Dependencies**: Tasks 1.1, 1.2, 1.3, 1.4
- **Steps**:
  1. Implement Vehicle Routing Problem (VRP) heuristic prioritizing high-severity/drifting debris reachable within unit range.
  2. Solve optimal waypoint order (TSP 2-opt) from home base -> debris 1..N -> return base.
  3. Check grid collision avoidance against landmasses.
  4. Output structured Mission plan with estimated duration, energy required (kWh), and expected cleanup yield (kg).
- **Verification**: Unit tests testing TSP route ordering and energy feasibility.

---

### Task 2.1: Marine Preservation Agent & Autonomous Cleanup Tools (CrewAI)
- **Target Files**:
  - `backend/app/agents/crew_tools.py`
  - `backend/app/agents/toolkit.py`
  - `backend/app/agents/triton_crew.py`
- **Dependencies**: Tasks 1.2, 1.3, 1.5
- **Steps**:
  1. Add tools: `analyze_debris_hazards_tool`, `predict_debris_drift_tool`, `plan_cleanup_mission_tool`, `dispatch_cleanup_fleet_tool`.
  2. Add **Marine Preservation & Cleanup Agent** in `triton_crew.py` with oceanographic and robotics domain prompts.
- **Verification**: Test tool invocation via agent toolkit.

---

### Task 2.2: Unified Maritime Commander Tri-Domain Integration & Trace
- **Target Files**:
  - `backend/app/agents/commander_hook.py`
  - `backend/app/agents/triton_crew.py`
  - `backend/app/api/agents.py`
- **Dependencies**: Task 2.1
- **Steps**:
  1. Connect Maritime Commander across Logistics, Surveillance, and Preservation domains.
  2. Implement cross-domain alert triggers (e.g. dark vessel fuel spill -> triggers preservation investigation).
  3. Include detailed agent traces (delegations, tool outputs, thoughts) in `/api/v1/agents/orchestrate` response.
- **Verification**: Test orchestrator response structure with multi-domain query.

---

### Task 3.1: REST Endpoints for Fleet, Missions, Drift Forecast, and Impact Metrics
- **Target Files**:
  - `backend/app/api/debris.py`
  - `backend/app/api/fleet.py` (new)
  - `backend/app/api/missions.py` (new)
  - `backend/app/api/analytics.py`
  - `backend/app/main.py`
- **Dependencies**: Tasks 1.1 - 2.2
- **Steps**:
  1. Add `GET /api/v1/debris/{id}/drift` and `GET /api/v1/debris/clusters`.
  2. Create `fleet.py`: `GET /api/v1/fleet/units`, `POST /api/v1/fleet/units/{id}/command`.
  3. Create `missions.py`: `GET /api/v1/missions`, `POST /api/v1/missions/plan`, `POST /api/v1/missions/{id}/approve`, `POST /api/v1/missions/{id}/step`.
  4. In `analytics.py`, add `GET /api/v1/analytics/impact` calculating aggregated fuel saved, CO2 avoided, and plastic cleared.
- **Verification**: Test FastAPI router endpoints with test client.

---

### Task 3.2: Real-Time Telemetry & WebSocket Event Broadcasting
- **Target Files**:
  - `backend/app/events/websocket_publisher.py`
  - `backend/app/main.py`
  - `backend/app/services/debris/fleet_simulator.py`
- **Dependencies**: Task 3.1
- **Steps**:
  1. Broadcast `cleanup_telemetry`, `debris_drift_updated`, and `mission_status_changed` over `/ws/telemetry`.
  2. Hook simulator step into background loop.
- **Verification**: Test WebSocket listener receiving telemetry payloads.

---

### Task 3.3: Rich Seed Dataset & 3 Turnkey Demo Scenarios
- **Target Files**:
  - `backend/app/data/seed_data.py`
  - `backend/app/data/phase4_seed.py` (new)
  - `backend/app/api/simulation.py`
- **Dependencies**: Tasks 3.1, 3.2
- **Steps**:
  1. Seed 12 debris clusters, 4 autonomous cleanup units, and 2 active missions.
  2. Add `POST /api/v1/simulation/load-scenario/{id}` for:
     - Scenario A: `ghost_net_mpa`
     - Scenario B: `dark_vessel_spill`
     - Scenario C: `eco_corridor_voyage`
- **Verification**: Verify each scenario resets database to exact reproducible demo state.

---

### Task 4.1: Unified Ocean Map Multi-Layer Overlays (Leaflet)
- **Target Files**:
  - `frontend/src/components/OceanMap.tsx`
  - `frontend/src/components/map/DebrisLayer.tsx` (new)
  - `frontend/src/components/map/FleetLayer.tsx` (new)
  - `frontend/src/components/map/DriftVectorLayer.tsx` (new)
  - `frontend/src/components/map/MissionPathLayer.tsx` (new)
- **Dependencies**: Tasks 3.1, 3.3
- **Steps**:
  1. Create layer components for debris clusters, predicted drift arrows, autonomous drones/ASVs, and mission paths.
  2. Add multi-layer toggle HUD on the ocean map allowing operators to toggle individual layers.
- **Verification**: Browser visual inspection and marker click handling.

---

### Task 4.2: Autonomous Debris & Cleanup Fleet Mission Studio
- **Target Files**:
  - `frontend/src/pages/CleanupPage.tsx`
  - `frontend/src/components/cleanup/FleetRosterPanel.tsx` (new)
  - `frontend/src/components/cleanup/MissionPlannerModal.tsx` (new)
  - `frontend/src/services/api.ts`
  - `frontend/src/types/index.ts`
- **Dependencies**: Tasks 3.1, 4.1
- **Steps**:
  1. Update `CleanupPage.tsx` to display real debris clusters, live drift forecasts, fleet roster, and active missions.
  2. Implement mission planner dialog showing calculated route, battery budget, and one-click dispatch.
- **Verification**: Verify debris selection, mission modal popup, and fleet status updates.

---

### Task 4.3: Ask TRITON Agent Console with Visual Trace & Explainability
- **Target Files**:
  - `frontend/src/components/AgentOrchestratorConsole.tsx`
  - `frontend/src/pages/AgentsPage.tsx`
  - `frontend/src/components/agents/AgentTraceVisualizer.tsx` (new)
- **Dependencies**: Tasks 2.2, 3.1
- **Steps**:
  1. Render animated agent decision tree (Commander -> Specialists -> Tools -> Decision).
  2. Add Phase 4 demo query chips and model provider indicators.
- **Verification**: Submit queries and observe agent trace rendering.

---

### Task 4.4: Human-in-the-Loop Approval Flow & Incident/Mission Report Modal
- **Target Files**:
  - `frontend/src/components/ui/HumanApprovalModal.tsx` (new)
  - `frontend/src/components/ui/ReportExportModal.tsx` (new)
- **Dependencies**: Tasks 3.1, 4.2, 4.3
- **Steps**:
  1. Create `HumanApprovalModal.tsx` with Authorize, Replan, and Reject actions.
  2. Create `ReportExportModal.tsx` with printable executive intelligence summary.
- **Verification**: Test approval submission and report generation.

---

### Task 4.5: Global Impact & Sustainability Metrics HUD + Demo Scenario Quick-Switcher
- **Target Files**:
  - `frontend/src/components/shell/ImpactMetricsBar.tsx` (new)
  - `frontend/src/components/shell/DemoScenarioSwitcher.tsx` (new)
  - `frontend/src/components/shell/TopBar.tsx`
  - `frontend/src/pages/CommandCenter.tsx`
  - `frontend/src/App.tsx`
- **Dependencies**: Tasks 3.3, 4.1, 4.2
- **Steps**:
  1. Add `ImpactMetricsBar` displaying live CO2 saved, fuel saved, and plastic collected.
  2. Add 1-click `DemoScenarioSwitcher` in TopBar for the 3 demo scenarios.
- **Verification**: Click each scenario button and verify page navigation and state update.

---

### Task 5.1: Backend & Frontend End-to-End Test Suite & Synthetic Fallbacks
- **Target Files**:
  - `backend/app/tests/test_phase4_e2e.py` (new)
  - `frontend/src/services/api.ts`
- **Dependencies**: All Phase 4 Tasks (1.1 - 4.5)
- **Steps**:
  1. Add comprehensive backend test suite covering debris drift, fleet simulation, mission planner, and demo scenarios.
  2. Add synthetic fallback data in frontend for 100% offline demonstration reliability.
- **Verification**: Run `pytest` on backend; run `npm run build` on frontend.

---

### Task 5.2: Final Architecture Documentation & Hackathon README Polish
- **Target Files**:
  - `README.md`
  - `docs/architecture.md`
- **Dependencies**: Task 5.1
- **Steps**:
  1. Update architecture diagrams, equations, and demo pitch scripts in `README.md`.
  2. Commit all changes to `feature/phase-4-command-center-demo`.
- **Verification**: Check formatting and markdown links.
