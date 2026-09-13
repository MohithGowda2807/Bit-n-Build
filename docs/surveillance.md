# Phase 3: Maritime Surveillance Backend

Dark-vessel detection, illegal-fishing intelligence, explainable risk, investigation cases, and the CrewAI agent layer. Everything here runs on the Phase 1 foundation (FastAPI, SQLAlchemy, GeoJSON geometry, Shapely) and works on SQLite locally or PostGIS in Docker.

## Pipeline

```
AIS provider (simulation or live)
  -> AISIngestor         raw positions, vessel upsert by MMSI, dark periods
  -> SurveillancePipeline geofence, loitering, fishing pattern, rendezvous, baseline deviation -> surveillance_events
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
| Behavior baseline and deviation scoring | `backend/app/services/surveillance/baseline.py`, `baseline_service.py` |
| Risk persistence, evidence, case workflow | `backend/app/services/surveillance/risk_service.py` |
| Event publisher seam (in-memory now, Redis from Phase 2) | `backend/app/events/publisher.py` |
| Commander entry point | `backend/app/agents/commander_hook.py` |
| Deterministic agent tools, CrewAI crews | `backend/app/agents/` |
| Demo zones and protected area | `backend/app/data/surveillance_seed.py` |

## Simulation scenarios

`POST /api/v1/simulation/run` with `{"scenario": "<name>"}` ingests a scripted track, runs detection and risk, and returns counts. A rerun wipes that scenario's earlier data first (`"reset": false` keeps it). `POST /api/v1/simulation/reset` removes every simulated vessel; Phase 1 seed vessels stay.

| Scenario | What happens | Expected outcome |
|----------|--------------|------------------|
| NORMAL_VESSEL | Cargo ship transits at 12 knots | No events, no risk; baseline deviation stays low |
| AIS_GAP | Fishing vessel goes dark 60 min, reappears inside a closed bank | Dark period, zone entry, ELEVATED risk |
| SUSPICIOUS_FISHING | Slow zig-zag passes inside a restricted ground | FISHING_PATTERN event |
| MPA_INTRUSION | Works the protected square slowly, then leaves | Zone entry and exit, fishing pattern |
| LOITERING | Drifts under 3 knots in authorized grounds for 3 h | LOITERING event, discounted risk |
| VESSEL_RENDEZVOUS | Fishing vessel and cargo ship stay within 1 km for 40 min | POSSIBLE_TRANSSHIPMENT for both |
| TRANSIT_ANOMALY | Cargo ship makes an unexplained detour | Track and baseline comparison only |
| DARK_FISHING_COMPOSITE | Closed bank, fishing, dark period, rendezvous | CRITICAL risk; cases opened for the fishing vessel and the cargo ship it met |

## Risk model

Score is the sum of five factors, capped at 100, banded LOW (0-20), MODERATE (21-40), ELEVATED (41-60), HIGH (61-80), CRITICAL (81-100).

| Factor | Max | Driver |
|--------|-----|--------|
| AIS_GAP | 28 | Longest gap, full score at 3 h |
| ZONE_ACTIVITY | 30 | Prohibited zone 25, restricted 15, +5 for 1 h dwell, +5 with fishing-like behaviour |
| FISHING_BEHAVIOR | 35 | Windowed fishing score; x1.25 inside prohibited zones, x0.4 inside authorized grounds |
| RENDEZVOUS | 15 | Possible transshipment 15, plain rendezvous 8, scaled by confidence |
| BEHAVIOR_DEVIATION | 15 | Deviation score from the vessel's behavior baseline (see below), scaled to 15 |

Thresholds `RISK_ALERT_THRESHOLD` (60) and `RISK_CASE_THRESHOLD` (80) are settings. Every factor carries an explanation and the event ids behind it; evidence rows and the case's frozen evidence snapshot are built from those events.

## Behavior baseline

Every tracked vessel gets one `vessel_behavior_profiles` row: average speed, speed spread, turning rate, AIS gap rate, hours observed and the 0.25-degree cells it usually works. The profile is **learned** from stored positions older than the current activity window when at least `BASELINE_MIN_HISTORY_HOURS` (12) of history exist; otherwise the provider's **historical** baseline is used. The simulation provider ships a scripted 30-day history per vessel type (fishing 6.5 kn, cargo 12 kn), which is what the demo scenarios compare against.

The last `BASELINE_CURRENT_HOURS` (6) of the track are scored against the profile: speed z-score (full 60 points at 3 sd, with a 1 kn floor on the spread), turning rate against the usual rate (20 points at 3x) and new AIS gaps for a vessel with none in its history (20 points). A score above 40 emits a `BEHAVIOR_DEVIATION` event with a plain-language explanation; the latest comparison is always kept on the profile and served by `GET /api/v1/vessels/{id}/baseline`.

## AIS sources

`AIS_PROVIDER` selects where ingestion pulls from. `simulation` (default) replays the scripted scenarios. `aisstream` connects to the free aisstream.io websocket with `AISSTREAM_API_KEY`, listens for `AIS_COLLECT_SECONDS` inside `AIS_BOUNDING_BOX` (min_lat,min_lon,max_lat,max_lon), and normalises position reports and static data onto the same `AISReport` and `AISVesselInfo` shapes; ship-type codes collapse onto FISHING, CARGO, TANKER and the other types the risk engine knows. `POST /api/v1/ais/ingest` (ADMIN) pulls one batch from the configured provider and runs detection and risk on it; `GET /api/v1/ais/provider` reports which source is active and whether it is configured. With a live source the behavior baseline learns from stored history once at least `BASELINE_MIN_HISTORY_HOURS` exist; until then vessels have no baseline factor, which is honest rather than invented.

## Access control

Roles are VIEWER < ANALYST < OPERATOR < ADMIN (spec sections 92-93). The caller sends `X-Role` and `X-User` headers; a missing role means VIEWER and an unknown one is a 400. Guards live in `backend/app/security.py` and every guarded route declares its minimum:

| Minimum role | Unlocks |
|--------------|---------|
| VIEWER | Every read: vessels, tracks, risk, events, zones, baselines, routes, storms, debris, fleet, missions, analytics |
| ANALYST | Investigations (read), case narrative, the analyst assistant and TRITON orchestrator, route previews, raising alerts and incidents, acknowledging alerts, reporting debris and track points |
| OPERATOR | Assign, escalate, resolve, dismiss; run and replay scenarios; approve agent decisions; plan routes that record a voyage version; inject storms, run the commander loop and load demo scenarios; create or update vessels, voyages and debris; plan, create, approve and command cleanup sorties |
| ADMIN | Reset the simulation, force a surveillance cycle, switch the operating mode, pull from the live AIS provider, register cleanup units |

Every write route across all four phases carries a guard; `POST /api/v1/auth/login` is the only open write. `POST /api/v1/routes/optimize` is the one nuance: any analyst may preview a corridor, but a request with `record_version` true rewrites the live voyage and needs an operator.

A refused call answers 403 with code `FORBIDDEN`, the required role and the caller's role. Case audit entries record the actor name and role. `GET /api/v1/auth/me` returns the caller's role and a permissions map the UI mirrors.

**Sign-in.** `POST /api/v1/auth/login` with a configured account (`AUTH_USERS`, `name:password:ROLE` entries; demo accounts admin, operator, analyst and viewer ship by default) returns a bearer token signed with `JWT_SECRET`, valid for `JWT_TTL_MINUTES`. A bearer token always wins. The `X-Role` and `X-User` headers remain a development convenience while `AUTH_ALLOW_ROLE_HEADER` is true; set it false in production and a token becomes the only way to hold a role. The top bar offers Sign in; the role picker is a dev shortcut that disappears when the header is not honoured.

## API

```
GET  /api/v1/auth/roles               GET /api/v1/auth/me                     POST /api/v1/auth/login   GET /api/v1/auth/session-policy
GET  /api/v1/vessels?mmsi=            GET /api/v1/vessels/{id}/track?hours=   GET /api/v1/vessels/{id}/risk
GET  /api/v1/vessels/{id}/baseline
GET  /api/v1/ais/gaps                 GET /api/v1/ais/gaps/{id}               GET /api/v1/ais/provider   POST /api/v1/ais/ingest
GET  /api/v1/fishing/zones            GET /api/v1/fishing/protected-areas     GET /api/v1/fishing/events
GET  /api/v1/surveillance/events      GET /api/v1/surveillance/risk           POST /api/v1/surveillance/run-cycle
GET  /api/v1/surveillance/heatmap?cell_degrees=0.25&hours=   (positions, detections, max risk per grid cell)
GET  /api/v1/investigations           GET /api/v1/investigations/{id}         GET /api/v1/investigations/dismiss-reasons
POST /api/v1/investigations/{id}/assign|escalate|resolve|dismiss|analyze
GET  /api/v1/simulation/scenarios     POST /api/v1/simulation/run             POST /api/v1/simulation/reset
POST /api/v1/simulation/replay        GET  /api/v1/simulation/replay/status
GET  /api/v1/assistant/status         POST /api/v1/assistant/ask
```

## Agents

The assistant tries providers in `LLM_PROVIDER_ORDER` (default `groq,gemini,openrouter`) and the investigation crew in `CREW_PROVIDER_ORDER` (default `gemini,groq,openrouter`); a provider joins a chain only when its key is set. The split follows the free tiers: Groq answers a single-agent question in seconds but allows only 8,000 tokens a minute on every model, which a four-agent crew exceeds in its first minute, while Gemini flash-lite allows about 15 requests a minute (`GEMINI_MAX_RPM` throttles the crew to 12) and finishes a narrative in 20 to 60 seconds. If one fails (quota, outage, bad output) the same crew is rerun on the next. Responses and case audit entries record which provider answered. With no keys at all, every deterministic feature still works and `/assistant/ask` and `/investigations/{id}/analyze` answer 503 with code `LLM_NOT_CONFIGURED`; when every configured provider fails they answer 502 with code `AGENT_RUN_FAILED`.

| Provider | Key | Default model (free tier, tool calling) |
|----------|-----|------------------------------------------|
| Gemini | `GEMINI_API_KEY` | `gemini/gemini-3.5-flash-lite`, capped by `GEMINI_MAX_RPM` (10; the full flash models only allow 5) |
| Groq | `GROQ_API_KEY` | `openai/gpt-oss-120b` via Groq's OpenAI-compatible endpoint |
| OpenRouter | `OPENROUTER_API_KEY` | `nvidia/nemotron-3-ultra-550b-a55b:free` (alternatives: `thinkingmachines/inkling:free`, `nvidia/nemotron-3-super-120b-a12b:free`) |

Free lists change often; `GET https://openrouter.ai/api/v1/models` shows current `:free` models and whether they support `tools`.

- Surveillance crew: AIS Monitoring Analyst, Fishing Activity Analyst, Behavioral Anomaly Analyst, Investigation Lead. Runs per vessel and writes a structured narrative onto the case.
- Assistant crew: one agent with all eleven tools answers operator questions such as "Why is vessel 12 high risk?".
- Tools live in `app/agents/toolkit.py` and return JSON from the database only.

## Live feed and replay

Surveillance events are published to the TRITON WebSocket at `/ws/telemetry` as `{"type": "surveillance_event", "data": {event_type, vessel_id, timestamp, payload}}` alongside Prajwal's `vessel_telemetry` messages. Event types worth rendering: `AIS_GAP_DETECTED`, `ZONE_ENTRY`, `FISHING_PATTERN`, `VESSEL_RENDEZVOUS`, `HIGH_RISK_VESSEL`, `CASE_CREATED`.

`POST /api/v1/simulation/replay {"scenario": "...", "step_seconds": 0.5}` runs the scenario (ingest, detect, score) and then animates it: one `replay_step` message per scripted report time with every vessel's position, `progress` from 0 to 1, and vessel live positions moved along so markers follow; `replay_complete` closes it. One replay runs at a time (409 otherwise).

## Wiring with the Phase 1 TRITON foundation

Prajwal's foundation commit added a parallel set of features. They are now connected at these points:

- His Vessel Watch agent consults the Phase 3 risk engine: when a vessel has an assessment, the finding carries `details.surveillance` (score, level, factors) and its risk level is raised to match, which feeds his human-approval gate.
- His orchestrator falls through to the Phase 3 assistant for questions (a `?` or a question word) when any LLM provider is configured, returning `assistant_answer` and `assistant_provider`; `use_assistant` forces or suppresses it.
- His kinematic step at `POST /api/v1/ais/simulate` skips scenario vessels (identifier `MMSI-*`), whose positions come from scripted AIS or replay.

Still separate:

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
