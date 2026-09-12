from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator


class Settings(BaseSettings):
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_ENV: str = "development"
    LOG_LEVEL: str = "INFO"

    # Database
    DATABASE_URL: str = "sqlite:///./oceansentinel.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"

    # Physics, Consumption, and Routing Configuration
    REFERENCE_SPEED_KNOTS: float = 15.0
    FUEL_PRICE_PER_LITER: float = 0.85
    CO2_EMISSION_FACTOR: float = 3.114  # kg CO2 per liter of marine diesel/MGO
    CARGO_FACTOR_COEFFICIENT: float = 0.0005
    GRID_RESOLUTION_DEG: float = 0.5
    GRID_VERSION: str = "1.0.0"
    MAX_ROUTE_CANDIDATES: int = 4

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
