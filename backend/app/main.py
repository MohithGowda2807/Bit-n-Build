import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.data.seed_data import seed_database
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
    ais
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
        logger.info("TRITON Phase 1 seed data verified and active.")
    except Exception as e:
        logger.warning(f"Seed data initialization warning: {e}")
    finally:
        db.close()
    yield
    logger.info("TRITON application shutting down.")


app = FastAPI(
    title="TRITON / OceanSentinel — Maritime Intelligence Platform",
    description="Multi-agent maritime logistics intelligence, autonomous route optimization, and ocean preservation platform (Phase 1 Foundation).",
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
app.include_router(analytics.router)


@app.get("/")
def root():
    return {
        "platform": "TRITON / OceanSentinel",
        "phase": 1,
        "name": "Maritime Intelligence & Autonomous Multi-Agent Platform",
        "status": "operational",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json",
        "websocket_url": "/ws/telemetry"
    }
