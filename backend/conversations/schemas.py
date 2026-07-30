from pydantic import BaseModel, Field
from datetime import datetime
import uuid
from enum import Enum

class MessageRole(str, Enum):
    AI = "AI"
    USER = "USER"
    SYSTEM = "SYSTEM"

class MessageInputType(str, Enum):
    TEXT = "TEXT"
    VOICE = "VOICE"

# Message Metadata Layer
class MessageMetadata(BaseModel):
    model_used: str | None = None
    latency_ms: int | None = None
    token_usage_prompt: int | None = None
    token_usage_completion: int | None = None
    finish_reason: str | None = None
    provider_name: str | None = None

class MessageBase(BaseModel):
    role: MessageRole
    input_type: MessageInputType = MessageInputType.TEXT
    content: str = Field(..., min_length=1)
    audio_url: str | None = None
    duration_seconds: int | None = None

class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)
    input_type: MessageInputType = MessageInputType.TEXT
    audio_url: str | None = None
    duration_seconds: int | None = None

class MessageResponse(MessageBase):
    id: uuid.UUID
    conversation_id: uuid.UUID
    created_at: datetime
    
    # Optional metadata (kept in response for internal testing/debugging)
    model_used: str | None = None
    latency_ms: int | None = None
    token_usage_prompt: int | None = None
    token_usage_completion: int | None = None
    finish_reason: str | None = None
    provider_name: str | None = None

    class Config:
        from_attributes = True

class ConversationBase(BaseModel):
    pass

class ConversationResponse(ConversationBase):
    id: uuid.UUID
    career_session_id: uuid.UUID
    started_at: datetime
    completed_at: datetime | None = None
    messages: list[MessageResponse] = []

    class Config:
        from_attributes = True
