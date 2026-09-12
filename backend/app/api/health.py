from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

try:
    import redis
except ImportError:
    redis = None

from app.database import get_db
from app.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health")
def get_health(db: Session = Depends(get_db)):
    db_status = "unhealthy"
    try:
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    redis_status = "unreachable"
    try:
        r = redis.from_url(settings.REDIS_URL, socket_timeout=1.0)
        if r.ping():
            redis_status = "healthy"
    except Exception:
        redis_status = "not_configured_or_offline"

    overall_status = "ok" if db_status == "healthy" else "degraded"

    return {
        "status": overall_status,
        "database": db_status,
        "redis": redis_status
    }
