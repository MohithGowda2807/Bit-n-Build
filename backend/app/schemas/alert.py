from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class AlertBase(BaseModel):
    alert_type: str = Field(..., max_length=100)
    severity: str = Field("warning", max_length=50)
    vessel_id: Optional[int] = None
    message: str = Field(..., max_length=255)
    details: Optional[str] = None
    acknowledged: bool = False
    status: str = Field("active", max_length=50)


class AlertCreate(AlertBase):
    pass


class AlertUpdate(BaseModel):
    acknowledged: Optional[bool] = None
    status: Optional[str] = None


class AlertResponse(AlertBase):
    id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
