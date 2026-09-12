import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.data.seed_data import seed_database
from app.api import health, vessels, ports, zones, routes, voyages, analytics

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("oceansentinel")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize schema and load deterministic seed data
    logger.info("Initializing database tables and seed dataset...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        logger.info("Seed data verified and active.")
    except Exception as e:
        logger.warning(f"Seed data initialization warning: {e}")
    finally:
        db.close()
    yield
    logger.info("OceanSentinel application shutting down.")


app = FastAPI(
    title="OceanSentinel - Maritime Intelligence Platform",
    description="Multi-agent maritime logistics intelligence, autonomous route optimization, and ocean preservation platform.",
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
                "code": "INVALID_COORDINATES_OR_PARAMETERS",
                "message": "Input validation failed. Ensure coordinates and parameters are valid.",
                "details": exc.errors()
            }
        }
    )


# Register API Routers
app.include_router(health.router)
app.include_router(vessels.router)
app.include_router(ports.router)
app.include_router(zones.router)
app.include_router(routes.router)
app.include_router(voyages.router)
app.include_router(analytics.router)


@app.get("/")
def root():
    return {
        "platform": "OceanSentinel",
        "phase": 1,
        "name": "Maritime Logistics Intelligence MVP",
        "docs_url": "/docs",
        "openapi_url": "/openapi.json"
    }
