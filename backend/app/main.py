import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.data.seed_data import seed_database
from app.data.surveillance_seed import seed_surveillance_zones
from app.agents.commander_hook import run_surveillance_cycle
from app.events.publisher import set_publisher
from app.events.websocket_publisher import WebSocketEventPublisher
from app.services.websocket.hub import ws_hub
from app.api import (
    health,
    vessels,
    ports,
    zones,
    routes,
    voyages,
    analytics,
    tracks,
    debris,
    weather,
    agents,
    alerts,
    ais,
    risk,
    simulation_scenario,
    simulation,
    surveillance,
    fishing,
    investigations,
    assistant,
    auth,
)

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("oceansentinel")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize schema and load deterministic seed data
    logger.info("Initializing database tables and Phase 1 seed dataset...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        seed_surveillance_zones(db)
        logger.info("TRITON Phase 1 seed data verified and active.")
    except Exception as e:
        logger.warning(f"Seed data initialization warning: {e}")
    finally:
        db.close()
    # Surveillance events (AIS gaps, high risk, cases) stream to WebSocket clients alongside telemetry.
    set_publisher(WebSocketEventPublisher(ws_hub, asyncio.get_running_loop()))
    loop_task = None
    if settings.SURVEILLANCE_CYCLE_SECONDS > 0:
        loop_task = asyncio.create_task(surveillance_loop(settings.SURVEILLANCE_CYCLE_SECONDS))
    yield
    if loop_task:
        loop_task.cancel()
    logger.info("TRITON application shutting down.")


async def surveillance_loop(interval_seconds: int):
    """Background autonomous mode: rerun detection and risk assessment on a fixed interval."""
    while True:
        await asyncio.sleep(interval_seconds)
        try:
            with SessionLocal() as db:
                summary = await asyncio.to_thread(run_surveillance_cycle, db)
            logger.info("Surveillance cycle: %s", summary.as_dict())
        except Exception as exc:
            logger.warning("Surveillance cycle failed: %s", exc)


app = FastAPI(
    title="TRITON / OceanSentinel — Maritime Intelligence Platform",
    description="Multi-agent maritime logistics intelligence, autonomous route optimization, maritime surveillance, and ocean preservation platform.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
origins = settings.cors_origins_list
if "*" not in origins:
    origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Input validation failed. Ensure coordinates and parameters are valid.",
                "details": exc.errors()
            }
        }
    )


# WebSocket Telemetry Endpoint
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_hub.connect(websocket)
    try:
        # Send initial connection acknowledgment
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to TRITON real-time telemetry stream."
        })
        while True:
            # Keep connection open and accept client messages (ping, commands, etc.)
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_hub.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket client session terminated: {e}")
        ws_hub.disconnect(websocket)


# Register API Routers
app.include_router(health.router)
app.include_router(vessels.router)
app.include_router(tracks.router)
app.include_router(ais.router)
app.include_router(debris.router)
app.include_router(weather.router)
app.include_router(agents.router)
app.include_router(alerts.router)
app.include_router(ports.router)
app.include_router(zones.router)
app.include_router(routes.router)
app.include_router(voyages.router)
app.include_router(risk.router)
app.include_router(analytics.router)
# Phase 2 & 3: simulation, scenarios, and autonomous commander
app.include_router(simulation_scenario.router)
# Phase 3: maritime surveillance
app.include_router(simulation.router)
app.include_router(surveillance.router)
app.include_router(fishing.router)
app.include_router(investigations.router)
app.include_router(assistant.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "platform": "TRITON / OceanSentinel",
        "phase": 3,
        "name": "Maritime Intelligence & Autonomous Multi-Agent Platform",
        "status": "operational",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json",
        "websocket_url": "/ws/telemetry"
    }
