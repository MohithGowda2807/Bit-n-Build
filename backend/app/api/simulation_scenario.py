from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.agent_decision import AgentDecisionLog
from app.schemas.storm import StormResponse, StormScenarioInject
from app.services.storm.service import storm_service
from app.agents.commander import maritime_commander
from app.security import require

router = APIRouter(prefix="/api/v1/simulation", tags=["Simulation & Scenario Injection"])


@router.post("/scenarios/inject-storm", response_model=List[StormResponse], dependencies=[Depends(require("OPERATOR"))])
def inject_storm_scenario(payload: StormScenarioInject, db: Session = Depends(get_db)):
    """
    Injects a preset maritime storm disturbance directly onto an active corridor
    to demonstrate live agent detection, risk evaluation, and dynamic re-routing.
    """
    storms = storm_service.inject_preset_scenario(db, payload.scenario_preset)
    return storms


@router.post("/scenarios/reset-environment", dependencies=[Depends(require("OPERATOR"))])
def reset_environment(db: Session = Depends(get_db)):
    """
    Clears all active storms and resets the oceanic environment to calm baseline conditions.
    """
    cleared = storm_service.clear_all_storms(db)
    return {
        "message": "Environment successfully reset to calm conditions.",
        "storms_cleared": cleared
    }


@router.get("/mode")
def get_operating_mode():
    """Retrieve current autonomous command mode (advisory, semi_autonomous, autonomous)."""
    return {"mode": maritime_commander.get_mode()}


@router.post("/mode", dependencies=[Depends(require("ADMIN"))])
def set_operating_mode(payload: Dict[str, str] = Body(..., example={"mode": "autonomous"})):
    """Set commander operating mode."""
    mode = payload.get("mode", "autonomous")
    if mode not in ("advisory", "semi_autonomous", "autonomous"):
        raise HTTPException(status_code=400, detail="Invalid mode. Allowed: advisory, semi_autonomous, autonomous")
    maritime_commander.set_mode(mode)
    return {"message": f"Commander mode set to {mode}", "mode": mode}


@router.post("/cycle", dependencies=[Depends(require("OPERATOR"))])
def execute_command_cycle(db: Session = Depends(get_db)):
    """
    Triggers an autonomous monitoring & decision cycle across both Environmental
    Dynamic Routing (Phase 2) and Surveillance (Phase 3).
    """
    return maritime_commander.run_full_command_cycle(db)


@router.get("/demo-scenarios")
def get_available_scenarios():
    """Returns available 1-click turn-key presentation demo scenarios."""
    return [
        {
            "id": "ghost_net_mpa",
            "title": "Lakshadweep Ghost Net Crisis & ASV Intercept",
            "subtitle": "Marine Preservation & Autonomous Fleet",
            "description": "Critical 1,450 kg abandoned monofilament ghost net drifting at 1.6kt toward the Lakshadweep Coral Reserve. Autonomous dispatch and containment mission for SeaSweeper-Alpha.",
            "category": "preservation",
            "threat_level": "critical",
            "target_entity": "DEB-LAK-001 (Ghost Net)",
            "focus": {"latitude": 10.42, "longitude": 72.15, "zoom": 10},
            "suggested_unit": "SeaSweeper-Alpha",
            "badge_color": "emerald"
        },
        {
            "id": "dark_vessel_spill",
            "title": "Mumbai Offshore Dark Trawler & Chemical Slick",
            "subtitle": "Maritime Surveillance & Ecological Threat",
            "description": "AIS transponder blackout detected 18 NM offshore Mumbai, correlated with a 1,200 m² SAR synthetic aperture radar slick anomaly. Triggers autonomous surveillance UAV intercept.",
            "category": "surveillance",
            "threat_level": "critical",
            "target_entity": "DARK-V-771 (Offshore Slick)",
            "focus": {"latitude": 18.75, "longitude": 72.58, "zoom": 9},
            "suggested_unit": "OceanClean-Titan",
            "badge_color": "amber"
        },
        {
            "id": "eco_corridor_voyage",
            "title": "Arabian Sea Eco-Corridor Transit Optimization",
            "subtitle": "Dynamic Weather Rerouting & Decarbonization",
            "description": "Deep monsoon depression intersects Mumbai-to-Kochi commercial shipping channel. Dynamic agent rerouting routes MV Ocean Sentinel around the 46kt wind core, saving 8.4 tons of fuel.",
            "category": "routing",
            "threat_level": "high",
            "target_entity": "MV Ocean Sentinel (MMSI 419000123)",
            "focus": {"latitude": 15.50, "longitude": 71.50, "zoom": 7},
            "suggested_unit": "CoralGuard-Interceptor",
            "badge_color": "cyan"
        }
    ]


@router.post("/load-scenario/{scenario_id}")
def load_scenario(scenario_id: str, db: Session = Depends(get_db)):
    """
    Loads and activates a turnkey demo scenario with pre-configured telemetry,
    alerts, debris/vessel hazards, and optimal focus settings for presentation.
    """
    from app.models.debris import Debris
    from app.models.cleanup_unit import CleanupUnit
    from app.models.mission import Mission
    from app.models.alert import Alert
    from app.models.vessel import Vessel
    import json

    if scenario_id == "ghost_net_mpa":
        # 1. Locate or ensure Lakshadweep ghost net
        debris = db.query(Debris).filter(Debris.debris_type == "ghost_net").first()
        if not debris:
            debris = Debris(
                latitude=10.42,
                longitude=72.15,
                debris_type="ghost_net",
                estimated_size_m2=650.0,
                estimated_mass_kg=1450.0,
                density_category="critical",
                severity=91.0,
                clean_up_priority="urgent",
                status="detected",
                confidence=0.96,
                drift_heading_deg=84.0,
                drift_speed_knots=1.6,
                target_species_threatened="Olive Ridley Sea Turtles & Brain Corals",
                environmental_risk_score=94.0,
                nearest_mpa_distance_nm=11.5,
                description="Massive abandoned monofilament gillnet drifting directly toward Lakshadweep Reef system."
            )
            db.add(debris)
            db.commit()
            db.refresh(debris)

        # 2. Reset / prepare SeaSweeper-Alpha unit
        unit = db.query(CleanupUnit).filter(CleanupUnit.unit_name == "SeaSweeper-Alpha").first()
        if not unit:
            unit = CleanupUnit(
                unit_name="SeaSweeper-Alpha",
                unit_type="asv_skimmer",
                latitude=9.96,
                longitude=76.22,
                heading_deg=280.0,
                speed_knots=9.5,
                battery_pct=96.0,
                max_range_nm=140.0,
                capacity_kg=2000.0,
                current_load_kg=250.0,
                status="idle"
            )
            db.add(unit)
            db.commit()
            db.refresh(unit)

        # 3. Add critical alert
        alert = Alert(
            alert_type="MPA_DEBRIS_ENCROACHMENT",
            severity="critical",
            message=f"CRITICAL: Ghost net ({debris.estimated_mass_kg:.0f} kg) drifting toward Lakshadweep Coral Reserve (11.5 NM).",
            details="Estimated time to reef collision: 7.2 hours. Urgent ASV deployment required to prevent gear entanglement.",
            status="active"
        )
        db.add(alert)
        db.commit()

        return {
            "success": True,
            "scenario_id": scenario_id,
            "title": "Lakshadweep Ghost Net Crisis",
            "focus": {"latitude": 10.42, "longitude": 72.15, "zoom": 10},
            "primary_debris_id": debris.id,
            "suggested_unit_id": unit.id,
            "recommendation": "Deploy SeaSweeper-Alpha or dispatch AquaDrone-Eco1 for localized acoustic cutting.",
            "alert": {
                "id": alert.id,
                "message": alert.message,
                "severity": alert.severity
            }
        }

    elif scenario_id == "dark_vessel_spill":
        # 1. Chemical slick debris
        slick = db.query(Debris).filter(Debris.debris_type == "chemical_slick").first()
        if not slick:
            slick = Debris(
                latitude=18.75,
                longitude=72.58,
                debris_type="chemical_slick",
                estimated_size_m2=1200.0,
                estimated_mass_kg=3200.0,
                density_category="critical",
                severity=88.0,
                clean_up_priority="urgent",
                status="detected",
                confidence=0.92,
                drift_heading_deg=165.0,
                drift_speed_knots=1.2,
                target_species_threatened="Coastal Fisheries & Mangrove Biome",
                environmental_risk_score=89.0,
                nearest_mpa_distance_nm=65.0,
                description="Heavy diesel and synthetic residue sheen trailing from recent dark-vessel rendezvous."
            )
            db.add(slick)
            db.commit()
            db.refresh(slick)

        # 2. Add surveillance alert
        alert = Alert(
            alert_type="DARK_VESSEL_SPILL",
            severity="critical",
            message="SECURITY: Dark vessel transponder blackout detected with trailing chemical residue slick.",
            details="Sentinel-1 SAR detected 1,200 m² radar backscatter anomaly matching hydrocarbon discharge.",
            status="active"
        )
        db.add(alert)
        db.commit()

        return {
            "success": True,
            "scenario_id": scenario_id,
            "title": "Mumbai Offshore Dark Trawler & Fuel Slick",
            "focus": {"latitude": 18.75, "longitude": 72.58, "zoom": 9},
            "primary_debris_id": slick.id,
            "recommendation": "Launch OceanClean-Titan for skimmer containment while notifying Maritime Coast Guard.",
            "alert": {
                "id": alert.id,
                "message": alert.message,
                "severity": alert.severity
            }
        }

    elif scenario_id == "eco_corridor_voyage":
        # 1. Inject Arabian Sea monsoon depression
        storms = storm_service.inject_preset_scenario(db, "arabian_sea_monsoon")

        # 2. Alert for dynamic reroute
        alert = Alert(
            alert_type="DYNAMIC_REROUTE_SUGGESTION",
            severity="warning",
            message="WEATHER: Arabian Sea Depression ARB-02 intersects Mumbai-Kochi shipping corridor.",
            details="Eco-Corridor Alpha proposed: +14 NM distance but saves 8.4t bunker fuel and maintains 0% storm core exposure.",
            status="active"
        )
        db.add(alert)
        db.commit()

        return {
            "success": True,
            "scenario_id": scenario_id,
            "title": "Arabian Sea Eco-Corridor Transit Optimization",
            "focus": {"latitude": 15.50, "longitude": 71.50, "zoom": 7},
            "storm_count": len(storms),
            "recommendation": "Adopt Autonomous Commander dynamic waypoint corridor divert.",
            "alert": {
                "id": alert.id,
                "message": alert.message,
                "severity": alert.severity
            }
        }

    else:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown scenario '{scenario_id}'. Available: ghost_net_mpa, dark_vessel_spill, eco_corridor_voyage"
        )


@router.get("/decisions")
def get_agent_decisions(limit: int = Query(default=20, le=100), db: Session = Depends(get_db)):
    """Retrieve audit trail of multi-agent decisions and route recalculations."""
    logs = db.query(AgentDecisionLog).order_by(AgentDecisionLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "agent_name": l.agent_name,
            "action": l.action,
            "trigger_event": l.trigger_event,
            "target_id": l.target_id,
            "reason": l.reason,
            "confidence": l.confidence,
            "mode": l.mode,
            "created_at": l.created_at
        }
        for l in logs
    ]
