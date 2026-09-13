# OceanSentinel / TRITON

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

OceanSentinel is a maritime command platform: it plans low-emission shipping routes, reroutes them around storms, detects dark vessels and illegal fishing, opens investigation cases with evidence, and dispatches an autonomous cleanup fleet at marine debris. One FastAPI backend, one React command center, four phases:

| Phase | Domain | What it does |
|-------|--------|--------------|
| 1 | Logistics | A* ocean routing, fuel, CO₂ and ETA models, multi-objective ranking, explainable recommendations, the TRITON orchestrator |
| 2 | Environment | Weather and ocean-current feeds, storm scenarios, the Maritime Commander loop that reroutes live voyages and records route lineage |
| 3 | Surveillance | AIS ingestion, AIS-gap, geofence, fishing, loitering and rendezvous detection, behavioral baselines, explainable risk, cases, CrewAI agents, roles and sign-in |
| 4 | Autonomous fleet | Debris drift forecasts, ASV and drone fleet simulation, VRP mission planning, dispatch with human approval, briefing export |

---

## Architecture

```
Browser: Landing → Command Center (Logistics · Environment · Surveillance · Autonomous Fleet · Ask TRITON)
            │ REST /api/v1                                  │ WebSocket /ws/telemetry
            ▼                                               ▼
FastAPI ─ routing · optimization · storms · commander loop · AIS providers · detection · risk · cases
        ─ CrewAI crews (Groq, Gemini and OpenRouter with fallback) · debris drift · fleet simulator · mission planner
            ▼
SQLAlchemy ─ SQLite locally, PostgreSQL/PostGIS in Docker
```

Access is role-based (VIEWER < ANALYST < OPERATOR < ADMIN). Every write route carries a guard; the UI disables what the current role cannot do. Sign in with a demo account (admin, operator, analyst or viewer; the password is the name) for a bearer token, or use the role picker while the dev role header is allowed.

---

## Highlights by phase

**Logistics (Phase 1).** 8-directional A* over an ocean grid with landmass avoidance; Haversine distance; cubic speed-power fuel model with cargo loading; CO₂ at 3.114 kg/L; Fastest, Fuel efficient, Green and Balanced presets; a "why this route" explanation with savings against the fastest candidate. Seeded with 10 vessels, 10 ports and 6 marine zones.

**Environment (Phase 2).** Storm presets (Bay of Bengal cyclone, Malacca squall, Arabian Sea monsoon) injected on demand; weather and current lookups per vessel; a commander cycle that finds voyages whose active route crosses a storm, recalculates them and records a new route version, so Lineage History shows every HAZARD AVOIDANCE reroute. Advisory, semi-auto and autonomous operating modes.

**Surveillance (Phase 3).** AIS behind a provider interface (eight scripted scenarios, plus a live aisstream.io provider). Detection of dark periods, protected-area and fishing-zone incursions, fishing patterns, loitering and rendezvous. A per-vessel behavior baseline turns deviations into a fifth risk factor. Risk is a weighted 0-100 score with per-factor explanations and evidence rows; cases open above a threshold with a frozen evidence snapshot, an audit log and assign, escalate, resolve and dismiss actions. A four-agent CrewAI investigation crew and an analyst assistant run only deterministic tools. Replay animates a scenario with the dark window marked; a heatmap shows where activity concentrates.

**Autonomous fleet (Phase 4).** Debris patches with leeway drift forecasts and uncertainty; ASV skimmers, drones and interceptors with battery and payload kinetics, moving along their waypoints in a background loop; a VRP and 2-opt mission planner; plan, authorize and dispatch from the Mission Studio; fleet commands (hold, return, resume); a printable executive briefing; one-click demo scenarios in the top bar.

**Frontend.** A single Mapbox-inspired dark design system ([design/DESIGN.md](./design/DESIGN.md)) across every page: Night and Chart basemaps, layer chips, watchlists, evidence panels, timeline and replay, the case screen, the mission studio and the briefing. When the API is unreachable the Surveillance page shows a clearly labelled sample dataset instead of a blank map, and swaps to live data as soon as the API answers.

Details: [docs/surveillance.md](./docs/surveillance.md), [docs/routing.md](./docs/routing.md), [docs/architecture.md](./docs/architecture.md), [docs/api.md](./docs/api.md), [docs/database.md](./docs/database.md).

---

## Demo walkthrough

Start both servers on a fresh database (delete `oceansentinel.db` in the directory you launch from), then, as the Operator:

1. **Surveillance**: run the *Dark Fishing & Rendezvous* scenario. Two cases open; select FV Night Hauler to see the five risk factors, the baseline block and the Timeline.
2. **Case 1**: Generate narrative (the four-agent crew runs on Gemini and takes 20 to 60 seconds; the Ask TRITON assistant answers in about five seconds on Groq), then Escalate. The audit log records who did what and in which role.
3. **Replay**: back on Surveillance, press Replay and watch the cursor cross the amber dark window.
4. **Logistics**: Inject hazard with the *Sumatra Squall* preset. The commander reroutes the live voyage; the map shows the avoidance route and Lineage History gains a HAZARD AVOIDANCE version.
5. **Autonomous Fleet**: Plan Autonomous Sortie, Generate Optimized Plan, Authorize & Dispatch. The assigned unit leaves port and its position updates on the map.
6. **Roles**: switch to Viewer and watch the run, plan, dispatch and case actions lock; the API refuses them too.

---

## Getting started

### Docker Compose

```bash
git clone https://github.com/MohithGowda2807/Bit-n-Build.git
cd Bit-n-Build
docker compose up --build
```

Command center at `http://localhost:5173`, API docs at `http://localhost:8000/docs`.

### Local development

Backend (Python 3.11+, [uv](https://docs.astral.sh/uv/)):

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Frontend (Node 18+):

```bash
cd frontend
npm install
npm run dev
```

Copy `.env.example` to `backend/.env`. Set at least one of `GROQ_API_KEY`, `GEMINI_API_KEY` or `OPENROUTER_API_KEY` to enable the agent layer; everything else works without a key. The assistant tries Groq first (fast, but its free tier allows only 8,000 tokens a minute); the investigation crew tries Gemini first because it needs more than that per narrative. Both chains fall through to the remaining providers. Set `JWT_SECRET` before deploying. `AIS_PROVIDER=aisstream` with an `AISSTREAM_API_KEY` switches Surveillance to live traffic.

The database schema is created on startup and there are no migrations: after pulling a change that adds a column, delete the local SQLite file.

---

## Testing

```bash
cd backend && uv run pytest -q          # 231 tests, no API key needed (agents use fake providers)
cd frontend && npm test                 # vitest: risk bands, formatting, track splitting, replay, heatmap, session
cd frontend && npm run test:e2e         # Playwright: needs both servers running, ideally on a fresh database
```

Backend coverage by area: Phase 1 routing and physics; AIS ingestion and each detector; risk, baselines and cases; access control across every write route; JWT sign-in; the aisstream provider (fed recorded messages); heatmap; route lineage; debris drift; fleet movement; Phase 4 API; agents and the event publisher. Set `TEST_DATABASE_URL` to run against PostGIS.

The seven browser tests cover the landing launch, the composite scenario through to an escalated case, timeline and replay, the viewer lockout and sign-in, the sample-data fallback when the API is down, the hazard reroute, and a sortie dispatch.

---

## Project structure

```
backend/
  pyproject.toml          # uv project; requirements.txt kept in sync for Docker and Render
  app/
    main.py               # routers, seeds, WebSocket hub, surveillance and fleet loops
    security.py           # roles, JWT sign-in, route guards
    api/                  # one router per domain
    models/ schemas/      # SQLAlchemy and Pydantic
    services/
      routing/ optimization/ fuel/ emissions/ eta/     # Phase 1
      weather/ ocean/ storm/                           # Phase 2
      ais/ surveillance/                               # Phase 3 (providers, detectors, risk, baseline, replay, heatmap)
      debris/                                          # Phase 4 (drift, clustering, mission planner, fleet)
    agents/               # CrewAI toolkit, provider fallback, crews, TRITON orchestrator
    data/                 # deterministic seeds
    tests/
frontend/
  src/
    design/               # tokens.css and pure helpers (risk, replay, timeline, heatmap, roles)
    components/           # shell/ ui/ map/ surveillance/ routing/ cleanup/ agents/ reports/
    pages/                # Landing, Logistics, Environment, Surveillance, Case, Cleanup, Agents
    services/             # api.ts, surveillance.ts, session.ts, telemetry.ts
    data/                 # sample dataset used only when the API is unreachable
  e2e/                    # Playwright demo-path tests
design/                   # DESIGN.md and the design canvas artboards
docs/                     # architecture, routing, database, api, surveillance
render.yaml, docker-compose.yml, .env.example
```
