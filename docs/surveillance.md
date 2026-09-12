# Phase 3: Maritime Surveillance Backend

Dark-vessel detection, illegal-fishing intelligence, explainable risk, investigation cases, and the CrewAI agent layer. Everything here runs on the Phase 1 foundation (FastAPI, SQLAlchemy, GeoJSON geometry, Shapely) and works on SQLite locally or PostGIS in Docker.

## Pipeline

```
AIS provider (simulation or live)
  -> AISIngestor         raw positions, vessel upsert by MMSI, dark periods
  -> SurveillancePipeline geofence, loitering, fishing pattern, rendezvous -> surveillance_events
  -> RiskService         weighted factors -> vessel_risk_scores + evidence -> investigation_cases
  -> Event publisher     AIS_GAP_DETECTED, ZONE_ENTRY, HIGH_RISK_VESSEL, CASE_CREATED ...
  -> CrewAI agents       investigation narrative and natural-language questions (Gemini)
```

All detection is deterministic. The LLM only reads tool output; it never scores risk or declares wrongdoing.

## Key modules

| Area | Path |
|------|------|
| AIS provider interface and simulation scenarios | `backend/app/services/ais/` |
| AIS gap detector, geofence, feature engine, detectors | `backend/app/services/surveillance/` |
| Risk weights and factor explanations | `backend/app/services/surveillance/risk.py` |
| Risk persistence, evidence, case workflow | `backend/app/services/surveillance/risk_service.py` |
| Event publisher seam (in-memory now, Redis from Phase 2) | `backend/app/events/publisher.py` |
| Commander entry point | `backend/app/agents/commander_hook.py` |
| Deterministic agent tools, CrewAI crews | `backend/app/agents/` |
| Demo zones and protected area | `backend/app/data/surveillance_seed.py` |

## Simulation scenarios

`POST /api/v1/simulation/run` with `{"scenario": "<name>"}` ingests a scripted track, runs detection and risk, and returns counts. A rerun wipes that scenario's earlier data first (`"reset": false` keeps it). `POST /api/v1/simulation/reset` removes every simulated vessel; Phase 1 seed vessels stay.

| Scenario | What happens | Expected outcome |
|----------|--------------|------------------|
| NORMAL_VESSEL | Cargo ship transits at 12 knots | No events, no risk |
| AIS_GAP | Fishing vessel goes dark 60 min, reappears inside a closed bank | Dark period, zone entry, ELEVATED risk |
| SUSPICIOUS_FISHING | Slow zig-zag passes inside a restricted ground | FISHING_PATTERN event |
| MPA_INTRUSION | Works the protected square slowly, then leaves | Zone entry and exit, fishing pattern |
| LOITERING | Drifts under 3 knots in authorized grounds for 3 h | LOITERING event, discounted risk |
| VESSEL_RENDEZVOUS | Fishing vessel and cargo ship stay within 1 km for 40 min | POSSIBLE_TRANSSHIPMENT for both |
| TRANSIT_ANOMALY | Cargo ship makes an unexplained detour | Track only (baseline model is future work) |
| DARK_FISHING_COMPOSITE | Closed bank, fishing, dark period, rendezvous | CRITICAL risk, investigation case opened |

## Risk model

Score is the sum of four factors, capped at 100, banded LOW (0-20), MODERATE (21-40), ELEVATED (41-60), HIGH (61-80), CRITICAL (81-100).

| Factor | Max | Driver |
|--------|-----|--------|
| AIS_GAP | 28 | Longest gap, full score at 3 h |
| ZONE_ACTIVITY | 30 | Prohibited zone 25, restricted 15, +5 for 1 h dwell, +5 with fishing-like behaviour |
| FISHING_BEHAVIOR | 35 | Windowed fishing score; x1.25 inside prohibited zones, x0.4 inside authorized grounds |
| RENDEZVOUS | 15 | Possible transshipment 15, plain rendezvous 8, scaled by confidence |

Thresholds `RISK_ALERT_THRESHOLD` (60) and `RISK_CASE_THRESHOLD` (80) are settings. Every factor carries an explanation and the event ids behind it; evidence rows and the case's frozen evidence snapshot are built from those events.

## API

```
GET  /api/v1/vessels?mmsi=            GET /api/v1/vessels/{id}/track?hours=   GET /api/v1/vessels/{id}/risk
GET  /api/v1/ais/gaps                 GET /api/v1/ais/gaps/{id}
GET  /api/v1/fishing/zones            GET /api/v1/fishing/protected-areas     GET /api/v1/fishing/events
GET  /api/v1/surveillance/events      GET /api/v1/surveillance/risk           POST /api/v1/surveillance/run-cycle
GET  /api/v1/investigations           GET /api/v1/investigations/{id}         GET /api/v1/investigations/dismiss-reasons
POST /api/v1/investigations/{id}/assign|escalate|resolve|dismiss|analyze
GET  /api/v1/simulation/scenarios     POST /api/v1/simulation/run             POST /api/v1/simulation/reset
GET  /api/v1/assistant/status         POST /api/v1/assistant/ask
```

## Agents

Providers are tried in `LLM_PROVIDER_ORDER` (default `groq,gemini,openrouter`; Groq answers in seconds, the others take minutes on free tiers); a provider joins the chain only when its key is set. If one fails (quota, outage, bad output) the same crew is rerun on the next. Responses and case audit entries record which provider answered. With no keys at all, every deterministic feature still works and `/assistant/ask` and `/investigations/{id}/analyze` answer 503 with code `LLM_NOT_CONFIGURED`; when every configured provider fails they answer 502 with code `AGENT_RUN_FAILED`.

| Provider | Key | Default model (free tier, tool calling) |
|----------|-----|------------------------------------------|
| Gemini | `GEMINI_API_KEY` | `gemini/gemini-3.5-flash-lite`, capped by `GEMINI_MAX_RPM` (10; the full flash models only allow 5) |
| Groq | `GROQ_API_KEY` | `openai/gpt-oss-120b` via Groq's OpenAI-compatible endpoint |
| OpenRouter | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` (alternatives: `thinkingmachines/inkling:free`, `nvidia/nemotron-3-super-120b-a12b:free`) |

Free lists change often; `GET https://openrouter.ai/api/v1/models` shows current `:free` models and whether they support `tools`.

- Surveillance crew: AIS Monitoring Analyst, Fishing Activity Analyst, Behavioral Anomaly Analyst, Investigation Lead. Runs per vessel and writes a structured narrative onto the case.
- Assistant crew: one agent with all eleven tools answers operator questions such as "Why is vessel 12 high risk?".
- Tools live in `app/agents/toolkit.py` and return JSON from the database only.

## Overlap with the Phase 1 TRITON foundation

Prajwal's foundation commit added a parallel set of features that coexist with Phase 3 but are not yet wired together:

- `GET /api/v1/vessels/{id}/tracks` returns his kinematic breadcrumbs (`tracks` table, written by `POST /api/v1/ais/simulate`); `GET /api/v1/vessels/{id}/track` returns Phase 3 AIS observations (`ais_positions`, written by scenario ingestion). The surveillance detectors read only `ais_positions`.
- `POST /api/v1/ais/simulate` nudges every vessel's live position, including scenario vessels. It does not touch stored AIS positions, dark periods, events or risk.
- `/api/v1/agents/*` is his TRITON agent framework with a deterministic fallback; `/api/v1/assistant/*` and `/investigations/{id}/analyze` are the Phase 3 CrewAI crews with the provider chain. Unifying them under the Phase 2 Commander is a team decision.

## Phase 2 integration points

- `run_surveillance_cycle(db)` in `app/agents/commander_hook.py` is the single call the Maritime Commander makes. `SURVEILLANCE_CYCLE_SECONDS` turns on a background loop in the meantime.
- `set_publisher(...)` in `app/events/publisher.py` swaps the in-memory publisher for the Phase 2 Redis bus.

## Running against PostgreSQL

The suite runs on both databases: `uv run pytest` uses a throwaway SQLite file; `TEST_DATABASE_URL=postgresql://oceansentinel:oceansentinel@localhost:5432/oceansentinel uv run pytest` targets the compose database. If a local PostgreSQL service already owns port 5432 (password errors for user `oceansentinel` are the symptom), map the container elsewhere, for example `5433:5432`, or stop the local service.

## Schema changes

Phase 1 has no migrations. After pulling new models, delete the local `oceansentinel.db` (or run `docker compose down -v`) so `create_all` recreates the tables.
