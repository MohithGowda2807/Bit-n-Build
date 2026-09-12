from datetime import timedelta
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas.surveillance import ScenarioInfo, SimulationRunRequest, SimulationRunResponse
from app.services.ais.simulation import SCENARIOS, SimulationAISProvider
from app.services.surveillance.ingestion import AISIngestor
from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService
from app.services.surveillance.reset import reset_all_simulation_data, reset_scenario
from app.utils_time import utcnow

router = APIRouter(prefix="/api/v1/simulation", tags=["Simulation"])


def _duration_minutes(scenario: str) -> int:
    return max(script.total_minutes() for script in SCENARIOS[scenario])


@router.get("/scenarios", response_model=List[ScenarioInfo])
def list_scenarios():
    return [
        ScenarioInfo(name=name, vessel_count=len(scripts), duration_minutes=_duration_minutes(name))
        for name, scripts in SCENARIOS.items()
    ]


@router.post("/run", response_model=SimulationRunResponse)
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


@router.post("/reset")
def reset_simulation(db: Session = Depends(get_db)):
    """Remove every simulated vessel and its surveillance data. Phase 1 seed vessels are kept."""
    summary = reset_all_simulation_data(db)
    return {"vessels_removed": summary.vessels_removed}
