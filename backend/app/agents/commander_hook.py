"""Entry point the Phase 2 Maritime Commander calls to run the surveillance domain.

One cycle: detect events from stored AIS, reassess risk, open or update cases.
Ingestion from a live provider is intentionally separate so the Commander can
schedule it independently.
"""
from dataclasses import asdict, dataclass

from sqlalchemy.orm import Session

from app.services.surveillance.pipeline import SurveillancePipeline
from app.services.surveillance.risk_service import RiskService


@dataclass
class CycleSummary:
    vessels_analyzed: int
    events_added: int
    vessels_assessed: int
    cases_opened: int
    cases_updated: int

    def as_dict(self) -> dict:
        return asdict(self)


def run_surveillance_cycle(db: Session) -> CycleSummary:
    analysis = SurveillancePipeline(db).run()
    assessment = RiskService(db).assess_all()
    return CycleSummary(
        vessels_analyzed=analysis.vessels_analyzed,
        events_added=analysis.events_added,
        vessels_assessed=assessment.vessels_assessed,
        cases_opened=assessment.cases_opened,
        cases_updated=assessment.cases_updated,
    )
