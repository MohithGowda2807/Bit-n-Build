"""Choose the AIS provider from settings: the scripted simulation by default, aisstream.io when configured."""
from datetime import timedelta
from typing import Tuple

from app.config import settings
from app.services.ais.provider import AISProvider, BoundingBox
from app.utils_time import utcnow

PROVIDERS = ("simulation", "aisstream")


class ProviderNotConfigured(RuntimeError):
    pass


def bounding_box() -> BoundingBox:
    parts = [float(p) for p in settings.AIS_BOUNDING_BOX.split(",")]
    if len(parts) != 4:
        raise ProviderNotConfigured("AIS_BOUNDING_BOX must be min_lat,min_lon,max_lat,max_lon")
    return (parts[0], parts[1], parts[2], parts[3])


def provider_status() -> dict:
    name = settings.AIS_PROVIDER.lower()
    configured = name == "simulation" or (name == "aisstream" and bool(settings.AISSTREAM_API_KEY))
    return {"provider": name, "configured": configured, "available": list(PROVIDERS),
            "bounding_box": settings.AIS_BOUNDING_BOX, "collect_seconds": settings.AIS_COLLECT_SECONDS}


def build_provider() -> AISProvider:
    name = settings.AIS_PROVIDER.lower()
    if name == "simulation":
        from app.services.ais.simulation import SCENARIOS, SimulationAISProvider
        scenario = "DARK_FISHING_COMPOSITE"
        duration = max(s.total_minutes() for s in SCENARIOS[scenario])
        return SimulationAISProvider(scenario, start_time=utcnow() - timedelta(minutes=duration))
    if name == "aisstream":
        if not settings.AISSTREAM_API_KEY:
            raise ProviderNotConfigured("AIS_PROVIDER is aisstream but AISSTREAM_API_KEY is not set")
        from app.services.ais.aisstream import AISStreamProvider
        return AISStreamProvider(settings.AISSTREAM_API_KEY, bounding_box(), settings.AIS_COLLECT_SECONDS)
    raise ProviderNotConfigured(f"Unknown AIS_PROVIDER '{settings.AIS_PROVIDER}'. Choose from {PROVIDERS}")
