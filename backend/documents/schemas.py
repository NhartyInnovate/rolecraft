from pydantic import BaseModel, Field
from datetime import datetime
import uuid
from enum import Enum

class ExportFileType(str, Enum):
    PDF = "PDF"
    DOCX = "DOCX"

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ExtractedField(BaseModel):
    value: str | None = None
    confidence: ConfidenceLevel = ConfidenceLevel.LOW

# CVDraft validation schemas
class CVDraftBase(BaseModel):
    content: dict = Field(...)

class CVDraftUpdate(CVDraftBase):
    pass

class CVDraftResponse(CVDraftBase):
    id: uuid.UUID
    career_session_id: uuid.UUID
    version: int
    updated_at: datetime

    class Config:
        from_attributes = True

# Upload responses
class UploadedCVResponse(BaseModel):
    id: uuid.UUID
    career_session_id: uuid.UUID
    filename: str
    created_at: datetime

    class Config:
        from_attributes = True

# Export responses
class ExportResponse(BaseModel):
    id: uuid.UUID
    career_session_id: uuid.UUID
    file_type: str
    storage_path: str

    class Config:
        from_attributes = True
