from datetime import timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas.surveillance import (
    ReplayRequest, ReplayStartResponse, ScenarioInfo, SimulationRunRequest, SimulationRunResponse,
)
from app.services.surveillance.replay import dark_window_fractions, replay_runner
import asyncio
from app.services.ais.simulation import SCENARIOS, SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService
from app.services.surveillance.reset import reset_all_simulation_data, reset_scenario
from app.utils_time import utcnow
from app.security import require

router = APIRouter(prefix="/api/v1/simulation", tags=["Simulation"])


def _duration_minutes(scenario: str) -> int:
    return max(script.total_minutes() for script in SCENARIOS[scenario])


@router.get("/scenarios", response_model=List[ScenarioInfo])
def list_scenarios():
    return [
        ScenarioInfo(name=name, vessel_count=len(scripts), duration_minutes=_duration_minutes(name))
        for name, scripts in SCENARIOS.items()
    ]


@router.post("/run", response_model=SimulationRunResponse, dependencies=[Depends(require("OPERATOR"))])
def run_scenario(payload: SimulationRunRequest, db: Session = Depends(get_db)):
    if payload.scenario not in SCENARIOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "UNKNOWN_SCENARIO", "message": f"Unknown scenario '{payload.scenario}'.",
                    "available": sorted(SCENARIOS)},
        )
    duration = _duration_minutes(payload.scenario)
    start_time = payload.start_time or (utcnow() - timedelta(minutes=duration))
    start_time = start_time.replace(tzinfo=None)
    end_time = start_time + timedelta(minutes=duration)

    provider = SimulationAISProvider(payload.scenario, start_time=start_time)
    if payload.reset:
        reset_scenario(db, [v.mmsi for v in provider.get_vessels()])
    summary = AISIngestor(db, settings.AIS_GAP_THRESHOLD_SECONDS).ingest(provider, now=end_time)
    analysis = SurveillancePipeline(db).run()
    assessment = RiskService(db).assess_all()
    return SimulationRunResponse(
        scenario=payload.scenario,
        start_time=start_time,
        end_time=end_time,
        vessels_created=summary.vessels_created,
        positions_added=summary.positions_added,
        dark_periods_added=summary.dark_periods_added,
        events_added=analysis.events_added,
        cases_opened=assessment.cases_opened,
        reset=payload.reset,
    )


@router.post("/reset", dependencies=[Depends(require("ADMIN"))])
def reset_simulation(db: Session = Depends(get_db)):
    """Remove every simulated vessel and its surveillance data. Phase 1 seed vessels are kept."""
    summary = reset_all_simulation_data(db)
    return {"vessels_removed": summary.vessels_removed}


@router.post("/replay", response_model=ReplayStartResponse, dependencies=[Depends(require("OPERATOR"))])
async def start_replay(payload: ReplayRequest, db: Session = Depends(get_db)):
    """Animate a scenario over the WebSocket feed: one replay_step per scripted report time, then replay_complete."""
    if payload.scenario not in SCENARIOS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"code": "UNKNOWN_SCENARIO", "message": f"Unknown scenario '{payload.scenario}'.",
                    "available": sorted(SCENARIOS)},
        )
    if replay_runner.running:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"code": "REPLAY_IN_PROGRESS", "message": f"Replay of {replay_runner.scenario} is still running."},
        )
    run = None
    if payload.run_analysis:
        run = await asyncio.to_thread(run_scenario, SimulationRunRequest(scenario=payload.scenario), db)
    start_time = run.start_time if run else utcnow() - timedelta(minutes=_duration_minutes(payload.scenario))
    steps = replay_runner.start(payload.scenario, start_time, payload.step_seconds)
    return ReplayStartResponse(
        status="started", scenario=payload.scenario, steps=steps, step_seconds=payload.step_seconds,
        start_time=start_time, end_time=start_time + timedelta(minutes=_duration_minutes(payload.scenario)),
        dark_windows=dark_window_fractions(payload.scenario),
    )


@router.get("/replay/status")
def replay_status():
    return replay_runner.status()
