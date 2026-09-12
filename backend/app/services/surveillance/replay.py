"""Historical replay: stream a scenario's scripted AIS reports over the WebSocket hub.

Each distinct report time becomes one `replay_step` message carrying every
vessel's position at that moment; vessel live positions in the database are
moved along so map markers follow. A final `replay_complete` message closes
the run. One replay runs at a time.
"""
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional

from app.services.ais.provider import AISReport
from app.services.ais.simulation import SimulationAISProvider

logger = logging.getLogger("oceansentinel.replay")


def _steps(provider: SimulationAISProvider) -> List[List[AISReport]]:
    by_time: Dict[datetime, List[AISReport]] = {}
    for report in provider.get_positions():
        by_time.setdefault(report.timestamp, []).append(report)
    return [by_time[t] for t in sorted(by_time)]


def _move_vessels(reports: List[AISReport]) -> Dict[str, int]:
    """Update live vessel positions for one step; returns mmsi -> vessel id."""
    from app.database import SessionLocal
    from app.models.vessel import Vessel

    ids: Dict[str, int] = {}
    with SessionLocal() as db:
        for report in reports:
            vessel = db.query(Vessel).filter_by(mmsi=report.mmsi).first()
            if not vessel:
                continue
            vessel.latitude, vessel.longitude = report.latitude, report.longitude
            vessel.heading = report.heading if report.heading is not None else report.course_over_ground
            vessel.speed_knots = report.speed_over_ground
            ids[report.mmsi] = vessel.id
        db.commit()
    return ids


class ReplayRunner:
    def __init__(self):
        self._task: Optional[asyncio.Task] = None
        self.scenario: Optional[str] = None
        self.total_steps = 0
        self.completed_steps = 0

    @property
    def running(self) -> bool:
        return self._task is not None and not self._task.done()

    def start(self, scenario: str, start_time: datetime, step_seconds: float) -> int:
        provider = SimulationAISProvider(scenario, start_time=start_time)
        steps = _steps(provider)
        self.scenario, self.total_steps, self.completed_steps = scenario, len(steps), 0
        self._task = asyncio.get_running_loop().create_task(self._run(steps, step_seconds))
        return len(steps)

    def status(self) -> Dict:
        return {"running": self.running, "scenario": self.scenario,
                "total_steps": self.total_steps, "completed_steps": self.completed_steps}

    async def _run(self, steps: List[List[AISReport]], step_seconds: float) -> None:
        from app.services.websocket.hub import ws_hub

        try:
            for index, reports in enumerate(steps, start=1):
                ids = await asyncio.to_thread(_move_vessels, reports)
                self.completed_steps = index
                await ws_hub.broadcast("replay_step", {
                    "scenario": self.scenario,
                    "sim_time": reports[0].timestamp.isoformat(),
                    "step": index,
                    "total_steps": len(steps),
                    "progress": round(index / len(steps), 4),
                    "vessels": [{
                        "mmsi": r.mmsi, "vessel_id": ids.get(r.mmsi), "latitude": r.latitude, "longitude": r.longitude,
                        "speed_knots": r.speed_over_ground, "course": r.course_over_ground,
                    } for r in reports],
                })
                if step_seconds:
                    await asyncio.sleep(step_seconds)
            await ws_hub.broadcast("replay_complete", {"scenario": self.scenario, "steps": len(steps)})
        except Exception as exc:
            logger.warning("Replay of %s failed: %s", self.scenario, exc)
            await ws_hub.broadcast("replay_failed", {"scenario": self.scenario, "error": str(exc)})


replay_runner = ReplayRunner()
