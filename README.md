# OceanSentinel — Maritime Intelligence Platform

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**OceanSentinel** is an autonomous multi-agent maritime command platform designed to optimize shipping logistics, enforce marine conservation boundaries, detect dark vessels, and coordinate ocean debris cleanup fleets.

This repository contains **Phase 1: Maritime Logistics Intelligence** (deterministic A* ocean routing, vessel hydrodynamics, emissions modeling, multi-objective ranking, explainable route recommendations) and **Phase 3: Maritime Surveillance** (AIS ingestion, dark-vessel and illegal-fishing detection, explainable risk scoring, investigation cases, and a CrewAI agent layer), served through one React command center with Logistics, Surveillance, Environment, Cleanup and Agents views.

---

## Architecture Overview

```
USER / OPERATOR
     │
     ▼
┌──────────────────────────────────────────────────────────────┐
│                 OceanSentinel Command Center (React)         │
│  Logistics · Surveillance · Environment · Cleanup · Agents   │
└──────────────┬───────────────────────────────┬───────────────┘
               │ REST API                      │ WebSocket /ws/telemetry
               ▼                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     FastAPI Backend Engine                   │
│                                                              │
│  Phase 1: Logistics            Phase 3: Surveillance         │
│  ┌──────────────────────┐      ┌──────────────────────────┐  │
│  │ A* Routing · Fuel    │      │ AIS Ingestion (provider  │  │
│  │ CO₂ & ETA · Multi-   │      │ + 8 simulation scenarios)│  │
│  │ Objective Optimizer  │      │ Gap · Geofence · Fishing │  │
│  └──────────────────────┘      │ Loitering · Rendezvous   │  │
│                                │ Risk Engine · Evidence   │  │
│  ┌──────────────────────┐      │ Investigation Cases      │  │
│  │ TRITON orchestrator  │◄────►└────────────┬─────────────┘  │
│  │ + CrewAI surveillance│                   │ events         │
│  │ crew (Groq / Gemini /│      ┌────────────┴─────────────┐  │
│  │ OpenRouter fallback) │      │ Event Publisher seam     │  │
│  └──────────────────────┘      │ (Phase 2 Redis bus later)│  │
│                                └──────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                PostgreSQL / PostGIS (SQLite locally)         │
│  Vessels · Ports · Zones · Routes · AIS positions · Dark     │
│  periods · Fishing zones · MPAs · Risk scores · Cases        │
└──────────────────────────────────────────────────────────────┘
```

---

## Phase 1 Features

- **A* Maritime Routing Engine**: 8-directional navigation over discrete coordinate ocean grid with continental landmass and obstacle avoidance.
- **Physical Consumption Modeling**:
  - Distance via Haversine great-circle formula in km and nautical miles.
  - Cubic speed power resistance factor: $(v / v_{\text{ref}})^3$.
  - Displacement draft cargo loading factor: $1 + (0.0005 \times \text{cargo\_tonnes})$.
  - Marine fuel cost and bunker pricing calculations.
- **CO₂ Emissions & ETA**: Accurate travel time estimation and carbon footprint ($3.114\text{ kg CO}_2 / \text{L}$).
- **Multi-Objective Optimization**:
  - Presets for **Fastest**, **Fuel Efficient**, **Green Eco-Corridor**, and **Balanced**.
  - Custom weight sliders with real-time normalization.
- **Explainable AI Recommendations**:
  - Detailed justification for chosen route ("Why this route?").
  - Quantified fuel savings and CO₂ avoided vs. baseline fastest route.
  - Transparent trade-offs (e.g. travel duration delta).
- **Interactive Command Center**:
  - Dark oceanic map with live vessel positions, global ports, and marine sanctuaries.
  - Interactive route planner (select ports or click map coordinates).
  - Telemetry HUD, candidate comparison matrix, and simulated voyage playback.
- **Deterministic Seed Data**: 10 distinct vessels, 10 global ports, and 6 marine zones preloaded.

---

## Phase 3: Maritime Surveillance

- **AIS ingestion** behind a provider interface, with eight scripted simulation scenarios for demos.
- **Detection**: AIS gaps (dark periods), fishing-zone and protected-area geofencing, loitering, fishing-pattern and rendezvous detectors.
- **Explainable risk**: weighted 0-100 score with per-factor explanations, evidence rows, and configurable alert and case thresholds.
- **Investigation cases** with assign, escalate, resolve, and dismiss workflow, frozen evidence snapshots, and an audit log.
- **CrewAI agents**: a four-agent investigation crew and a natural-language assistant, restricted to deterministic tools, running on Groq, Gemini and OpenRouter with automatic provider fallback.
- Run a scenario: `POST /api/v1/simulation/run {"scenario": "DARK_FISHING_COMPOSITE"}`, then open `GET /api/v1/investigations`.

- **Frontend**: a Mapbox-inspired dark system (see [design/DESIGN.md](./design/DESIGN.md)). Surveillance view with a Night/Chart basemap, watchlist, live events, vessel evidence panel, investigation case screen, replay and the analyst chat; the Phase 1 Command Center lives under Logistics.

Details in [docs/surveillance.md](./docs/surveillance.md).

---

## Getting Started

### 1. Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose **OR**
- Python 3.11+ and Node.js 18+

### 2. Running with Docker Compose (Recommended)
```bash
# Clone and enter directory
git clone https://github.com/MohithGowda2807/Bit-n-Build.git
cd Bit-n-Build

# Start all services (PostGIS, Redis, Backend, Frontend)
docker compose up --build
```
The Command Center will be available at `http://localhost:5173` and the API at `http://localhost:8000/docs`.

---

### 3. Running Locally (Development Mode)

#### Backend Setup
```bash
cd backend

# Install dependencies (uv creates .venv from pyproject.toml)
uv sync

# Run FastAPI backend server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Set at least one of `GROQ_API_KEY`, `GEMINI_API_KEY` or `OPENROUTER_API_KEY` in `backend/.env` to enable the Phase 3 agent layer (tried in that order); everything else runs without a key.
API Documentation will be active at: `http://localhost:8000/docs`.

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Testing

Run the automated backend test suite:
```bash
cd backend
uv run pytest -q
```

Frontend unit tests:
```bash
cd frontend
npm test
```

The backend suite runs against a local SQLite file by default; set `TEST_DATABASE_URL` to run it against PostGIS. Coverage by area:

- **Phase 1 logistics**: `test_haversine.py`, `test_fuel.py`, `test_eta.py`, `test_astar.py`, `test_optimization.py`, `test_api.py`, `test_phase1_foundation.py`.
- **AIS and detection**: `test_ais_position.py`, `test_ais_gap_detector.py`, `test_dark_period.py`, `test_geofence.py`, `test_features.py`, `test_loitering.py`, `test_fishing_pattern.py`, `test_rendezvous.py`, `test_analyzer.py`, `test_pipeline.py`, `test_ingestion.py`, `test_simulation_provider.py`.
- **Risk and cases**: `test_risk_engine.py`, `test_risk_service.py`, `test_surveillance_api.py`, `test_investigation_api.py`, `test_surveillance_seed.py`, `test_vessel_identity.py`.
- **Agents and events**: `test_agent_toolkit.py`, `test_crew.py`, `test_llm_providers.py`, `test_agent_api.py`, `test_triton_integration.py`, `test_event_publisher.py`, `test_events_api.py`, `test_websocket_publisher.py`, `test_settings.py`.
- **Frontend** (vitest): risk banding, time formatting and AIS-gap track splitting under `frontend/src/design/`.

Agent tests use fake LLM providers, so no API key is needed to run the suite.

---

## Project Structure

```
oceansentinel/
├── README.md
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── pyproject.toml     # uv project (requirements.txt kept in sync for Docker)
│   ├── Dockerfile
│   └── app/
│       ├── main.py        # Routers, seeds, WebSocket publisher, optional surveillance loop
│       ├── config.py      # Settings incl. risk thresholds and LLM provider order
│       ├── database.py
│       ├── models/        # Vessel, Port, Zone, Route, AISPosition, DarkPeriod, FishingZone,
│       │                  # MarineProtectedArea, SurveillanceEvent, VesselRiskScore, Evidence,
│       │                  # InvestigationCase
│       ├── schemas/       # Pydantic schemas
│       ├── services/
│       │   ├── routing/ fuel/ emissions/ eta/ optimization/ weather/ ocean/   # Phase 1
│       │   ├── ais/           # Provider interface, simulation scenarios, ingestion
│       │   ├── surveillance/  # Gap, geofence, loitering, fishing, rendezvous, risk, cases, replay
│       │   └── websocket/     # Telemetry hub
│       ├── agents/        # CrewAI toolkit, providers with fallback, investigation crew, TRITON
│       ├── events/        # Event publisher seam and WebSocket publisher
│       ├── api/           # REST endpoints (vessels, routes, ais, simulation, surveillance,
│       │                  # fishing, investigations, assistant, agents)
│       ├── data/          # Deterministic seeds (ports, vessels, zones, MPAs, fishing zones)
│       └── tests/         # pytest suite
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js # Design tokens as Tailwind theme
│   ├── vitest.config.ts
│   └── src/
│       ├── design/        # tokens.css, risk bands, formatting, track splitting, markdown-lite
│       ├── components/
│       │   ├── shell/ ui/ map/   # TopBar, primitives, BaseMap and basemap toggle
│       │   ├── surveillance/     # Map, watchlist, events, vessel, analyst, replay panels
│       │   └── ...               # Phase 1 OceanMap, RoutePlanner, RouteReplay, HUD
│       ├── pages/         # Logistics, Surveillance, Case, Environment, Cleanup, Agents
│       ├── services/      # api.ts, surveillance.ts, telemetry.ts (shared WebSocket)
│       └── types/
├── design/
│   ├── DESIGN.md          # Visual system: surfaces, type, risk scale, components
│   └── command-center/    # Design canvas artboards
└── docs/
    ├── architecture.md
    ├── routing.md
    ├── database.md
    ├── api.md
    └── surveillance.md
```

---

## Documentation

Detailed technical documents are available in the [`docs/`](./docs) folder:
- [Architecture Guide](./docs/architecture.md)
- [Routing & Optimization Algorithms](./docs/routing.md)
- [Database Schema & Data Dictionary](./docs/database.md)
- [API Reference](./docs/api.md)
- [Phase 3 Surveillance Backend](./docs/surveillance.md)
