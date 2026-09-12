# OceanSentinel — Maritime Intelligence Platform (Phase 1)

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**OceanSentinel** is an autonomous multi-agent maritime command platform designed to optimize shipping logistics, enforce marine conservation boundaries, detect dark vessels, and coordinate ocean debris cleanup fleets.

This repository contains the complete implementation of **Phase 1: Maritime Logistics Intelligence MVP**, featuring deterministic A* ocean route planning, vessel hydrodynamic physics, emissions modeling, multi-objective ranking, explainable route recommendations, and an interactive React Command Center.

---

## Architecture Overview

```
USER / OPERATOR
     │
     ▼
┌────────────────────────────────────────┐
│      Maritime Command Center (React)   │
│   Interactive Map & Telemetry HUD      │
└───────────────────┬────────────────────┘
                    │ REST API
                    ▼
┌────────────────────────────────────────┐
│          FastAPI Backend Engine        │
│                                        │
│   ┌───────────────┐ ┌───────────────┐  │
│   │ A* Routing    │ │ Hydrodynamic  │  │
│   │ Ocean Grid    │ │ Fuel Model    │  │
│   └───────┬───────┘ └───────┬───────┘  │
│           │                 │          │
│   ┌───────┴───────┐ ┌───────┴───────┐  │
│   │ CO₂ Emissions │ │ Multi-Obj     │  │
│   │ & ETA Engine  │ │ Optimizer     │  │
│   └───────────────┘ └───────────────┘  │
└───────────────────┬────────────────────┘
                    │
                    ▼
┌────────────────────────────────────────┐
│     PostgreSQL / PostGIS & Redis       │
│  (Vessels, Ports, Marine Zones, Routes)│
└────────────────────────────────────────┘
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

## Phase 3: Maritime Surveillance (backend)

- **AIS ingestion** behind a provider interface, with eight scripted simulation scenarios for demos.
- **Detection**: AIS gaps (dark periods), fishing-zone and protected-area geofencing, loitering, fishing-pattern and rendezvous detectors.
- **Explainable risk**: weighted 0-100 score with per-factor explanations, evidence rows, and configurable alert and case thresholds.
- **Investigation cases** with assign, escalate, resolve, and dismiss workflow, frozen evidence snapshots, and an audit log.
- **CrewAI agents**: a four-agent investigation crew and a natural-language assistant, restricted to deterministic tools, running on Gemini with automatic fallback to Groq and OpenRouter.
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
Set `GEMINI_API_KEY` (optionally `GROQ_API_KEY` and `OPENROUTER_API_KEY` as fallbacks) in `.env` to enable the Phase 3 agent layer; everything else runs without it.
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

Tests include:
- `test_haversine.py`: Great circle distance and nautical mile verification.
- `test_fuel.py`: Deterministic hydrodynamic consumption and cargo loading.
- `test_eta.py`: Speed scaling and timestamp projection.
- `test_astar.py`: Navigable ocean pathfinding and obstacle avoidance.
- `test_optimization.py`: Weight preference shifts across modes.
- `test_api.py`: FastAPI endpoints, validation, and error states.

---

## Project Structure

```
oceansentinel/
├── README.md
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── app/
│       ├── main.py
│       ├── config.py
│       ├── database.py
│       ├── models/        # SQLAlchemy Models (Vessel, Port, Zone, Route, Voyage)
│       ├── schemas/       # Pydantic Schemas & Validations
│       ├── services/      # Routing, Fuel, Emissions, ETA, Optimization
│       ├── api/           # REST Endpoints
│       ├── data/          # Deterministic Seeds
│       └── tests/         # Unit & Integration Tests
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/    # Navbar, OceanMap, RoutePlanner, HUD, Comparison, Replay
│       ├── pages/         # CommandCenter Dashboard
│       └── services/      # API integration client
└── docs/
    ├── architecture.md
    ├── routing.md
    ├── database.md
    └── api.md
```

---

## Documentation

Detailed technical documents are available in the [`docs/`](./docs) folder:
- [Architecture Guide](./docs/architecture.md)
- [Routing & Optimization Algorithms](./docs/routing.md)
- [Database Schema & Data Dictionary](./docs/database.md)
- [API Reference](./docs/api.md)
- [Phase 3 Surveillance Backend](./docs/surveillance.md)
