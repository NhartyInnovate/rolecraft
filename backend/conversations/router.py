from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from backend.core.db import get_db
from backend.auth.dependencies import get_current_user
from backend.users.models import User
from backend.conversations.schemas import ConversationResponse, MessageResponse, MessageCreate
from backend.conversations.services import get_or_create_conversation, submit_user_message
from sqlalchemy import select
from backend.conversations.models import Conversation
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/career-sessions", tags=["Conversations"])

@router.post("/{session_id}/conversation", response_model=ConversationResponse, status_code=status.HTTP_201_CREATED)
async def start_session_conversation(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify career session ownership before starting/creating conversation
    from backend.career_sessions.services import get_session_by_id
    await get_session_by_id(db, current_user.id, session_id)
    return await get_or_create_conversation(db, session_id)

@router.get("/{session_id}/conversation", response_model=ConversationResponse)
async def get_session_conversation(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from backend.career_sessions.services import get_session_by_id
    await get_session_by_id(db, current_user.id, session_id)
    
    # Reload conversation with messages eager loading
    result = await db.execute(
        select(Conversation)
        .where(Conversation.career_session_id == session_id)
        .options(selectinload(Conversation.messages))
    )
    conv = result.scalar_one_or_none()
    if not conv:
        # Auto-create if requested and missing
        conv = await get_or_create_conversation(db, session_id)
    return conv

@router.post("/{session_id}/conversation/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def post_message(
    session_id: uuid.UUID,
    message_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await submit_user_message(db, current_user.id, session_id, message_in)
