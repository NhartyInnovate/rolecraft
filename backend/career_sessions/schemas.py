from pydantic import BaseModel, Field
from datetime import datetime
import uuid
from enum import Enum

class SessionGoal(str, Enum):
    CREATE_CV = "CREATE_CV"
    IMPROVE_CV = "IMPROVE_CV"
    TAILOR_CV = "TAILOR_CV"
    COVER_LETTER = "COVER_LETTER"

class SessionStatus(str, Enum):
    CREATED = "CREATED"
    IN_PROGRESS = "IN_PROGRESS"
    AWAITING_REVIEW = "AWAITING_REVIEW"
    COMPLETED = "COMPLETED"
    ARCHIVED = "ARCHIVED"

class CareerSessionBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)

class CareerSessionCreate(BaseModel):
    goal: SessionGoal
    title: str | None = Field(None, max_length=255)

class CareerSessionUpdateStatus(BaseModel):
    status: SessionStatus

class CareerSessionResponse(CareerSessionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    goal: SessionGoal
    status: SessionStatus
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None = None

    class Config:
        from_attributes = True

class CareerSessionStatusResponse(BaseModel):
    document_uploaded: bool
    pending_review: bool
    draft_confirmed: bool
    cv_generated: bool
    cover_letter_generated: bool
    completion_percentage: int
