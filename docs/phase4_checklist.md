# Phase 4 Implementation Checklist — TRITON / OceanSentinel

**Branch**: `phase-4-command-center`  
**Goal**: Turn the working system into a presentation-ready, hackathon-winning Command Center + Unified Autonomous Marine Platform.

---

### Phase 4A: Core Backend Data & Physics
- [x] **Task 1.1**: Extended Debris & Autonomous Cleanup Fleet Data Schemas
  - [x] Extend `Debris` model (`cluster_id`, `estimated_mass_kg`, `drift_heading_deg`, `drift_speed_knots`, `confidence`)
  - [x] Implement `CleanupUnit` model (`unit_name`, `unit_type`, `battery_pct`, `capacity_kg`, `current_load_kg`, `status`)
  - [x] Extend `Mission` model with waypoints JSON, assigned unit, and energy estimates
  - [x] Create corresponding Pydantic schemas in `app/schemas/`
  - [x] Update `app/models/__init__.py`
- [ ] **Task 1.2**: Debris Drift & Ocean Current Physics Engine
  - [ ] Leeway physics drift calculation: $\vec{v}_{drift} = \alpha \vec{v}_{current} + \beta \vec{v}_{wind}$
  - [ ] Hourly trajectory forecast generator
  - [ ] Spatial clustering (DBSCAN/proximity) for debris sightings
- [ ] **Task 1.3**: Environmental Risk & MPA Interaction Engine
  - [ ] Distance calculation to nearest Marine Protected Areas
  - [ ] 24-48h drift trajectory collision detection with MPAs
  - [ ] Hazard calculation for commercial shipping channels
  - [ ] 0-100 composite environmental risk score and narrative
- [ ] **Task 1.4**: Autonomous Fleet Simulator & Energy/Payload Model
  - [ ] Battery drain model (hotel load + hydrodynamic drag $v^2$ + collection gear)
  - [ ] Payload capacity tracking & automatic return-to-base triggers
  - [ ] Simulation step function updating drone positions along waypoints
- [ ] **Task 1.5**: Mission Planner & Multi-Target VRP Optimization Engine
  - [ ] Vehicle Routing Problem (VRP) heuristic for cleanup units
  - [ ] TSP 2-opt waypoint optimization
  - [ ] Landmass avoidance validation

---

### Phase 4B: Agents & Multi-Agent Orchestration
- [ ] **Task 2.1**: Marine Preservation Agent & Autonomous Cleanup Tools
  - [ ] Register `analyze_debris_hazards_tool`, `predict_debris_drift_tool`, `plan_cleanup_mission_tool`, `dispatch_cleanup_fleet_tool`
  - [ ] Implement Marine Preservation & Cleanup Agent in `triton_crew.py`
- [ ] **Task 2.2**: Unified Maritime Commander Tri-Domain Integration
  - [ ] Cross-domain event bus (Logistics, Surveillance, Preservation)
  - [ ] Correlation of dark vessel spills with debris/slick hazards
  - [ ] Rich structured agent trace generation

---

### Phase 4C: API Gateway, WebSocket & Scenarios
- [ ] **Task 3.1**: REST Endpoints for Fleet, Missions, Drift, and Impact Metrics
  - [ ] `GET /api/v1/debris/{id}/drift` & `GET /api/v1/debris/clusters`
  - [ ] `GET /api/v1/fleet/units` & `POST /api/v1/fleet/units/{id}/command`
  - [ ] `GET /api/v1/missions`, `POST /api/v1/missions/plan`, `POST /api/v1/missions/{id}/approve`
  - [ ] `GET /api/v1/analytics/impact`
- [ ] **Task 3.2**: Real-Time Telemetry & WebSocket Event Broadcasting
  - [ ] WebSocket channels for `cleanup_telemetry`, `debris_drift_updated`, `mission_status_changed`
- [ ] **Task 3.3**: Rich Seed Dataset & 3 Turnkey Demo Scenarios
  - [ ] Arabian Sea / Indian Ocean realistic debris clusters & autonomous drone fleet
  - [ ] Scenario A: Ghost Net Crisis near Lakshadweep MPA
  - [ ] Scenario B: Dark Vessel + Diesel Spill Anomaly
  - [ ] Scenario C: Eco-Corridor Voyage Optimization

---

### Phase 4D: Frontend Command Center & UI Components
- [ ] **Task 4.1**: Unified Ocean Map Multi-Layer Overlays (Leaflet)
  - [ ] Commercial vessels, dark vessels, MPAs, debris clusters, drift arrows, drone paths
  - [ ] Layer toggle switcher HUD
- [ ] **Task 4.2**: Autonomous Debris & Cleanup Fleet Mission Studio
  - [ ] Interactive debris details drawer
  - [ ] Mission planner dialog with 1-click dispatch
  - [ ] Live fleet status (battery, payload, current task)
- [ ] **Task 4.3**: Ask TRITON Agent Console with Visual Trace & Explainability
  - [ ] Interactive multi-agent thought trace tree
  - [ ] Pre-set demo prompt chips
- [ ] **Task 4.4**: Human-in-the-Loop Approval Flow & Incident/Mission Reports
  - [ ] Approval modal (Authorize / Replan / Reject)
  - [ ] Printable Executive Intelligence Briefing modal
- [ ] **Task 4.5**: Global Impact & Sustainability Metrics HUD + Scenario Quick-Switcher
  - [ ] Sustainability KPI ticker (CO2 saved, fuel saved, plastic retrieved)
  - [ ] 1-click demo scenario buttons in TopBar

---

### Phase 4E: Verification, Polish, Documentation
- [ ] **Task 5.1**: Automated E2E Test Suite & 100% Offline Synthetic Fallbacks
- [ ] **Task 5.2**: Final Architecture Documentation & README Polish
