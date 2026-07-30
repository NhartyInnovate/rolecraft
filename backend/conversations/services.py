from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
import uuid
import time
from datetime import datetime, timezone

from backend.career_sessions.models import CareerSession
from backend.conversations.models import Conversation, Message
from backend.conversations.schemas import MessageCreate, MessageRole
from backend.ai.orchestrator import AIOrchestrator
from backend.ai.services.context_builder import DefaultContextBuilder
from backend.profiles.services import get_or_create_profile
from backend.profiles.schemas import ProfessionalProfileResponse

orchestrator = AIOrchestrator()
context_builder = DefaultContextBuilder(limit=10)

async def get_or_create_conversation(db: AsyncSession, session_id: uuid.UUID) -> Conversation:
    result = await db.execute(
        select(Conversation)
        .where(Conversation.career_session_id == session_id)
        .options(selectinload(Conversation.messages))
    )
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        conversation = Conversation(career_session_id=session_id)
        db.add(conversation)
        await db.commit()
        await db.refresh(conversation)
        
        # Reload with messages list
        result = await db.execute(
            select(Conversation)
            .where(Conversation.career_session_id == session_id)
            .options(selectinload(Conversation.messages))
        )
        conversation = result.scalar_one()
        
    return conversation

async def submit_user_message(
    db: AsyncSession,
    user_id: uuid.UUID,
    session_id: uuid.UUID,
    message_in: MessageCreate
) -> Message:
    # 1. Fetch Session & Validate ownership + read-only archived rules
    result = await db.execute(select(CareerSession).where(CareerSession.id == session_id))
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Career Session not found.")
    if session.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this session.")
    if session.status == "ARCHIVED":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Archived sessions are read-only.")
        
    # Automatically move status to IN_PROGRESS on first message exchange
    if session.status == "CREATED":
        session.status = "IN_PROGRESS"
        
    # 2. Retrieve Conversation
    conversation = await get_or_create_conversation(db, session_id)
    
    # 3. Persist User Message (Timeline Ordering Step 1)
    db_user_msg = Message(
        conversation_id=conversation.id,
        role=MessageRole.USER.value,
        input_type=message_in.input_type.value,
        content=message_in.content,
        audio_url=message_in.audio_url,
        duration_seconds=message_in.duration_seconds
    )
    db.add(db_user_msg)
    await db.commit()
    await db.refresh(db_user_msg)
    
    # 4. Load History Context for LLM (Timeline Ordering Step 2)
    history_result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at.asc())
    )
    db_messages = history_result.scalars().all()
    
    # Compile messages dictionary list
    raw_history = [{"role": msg.role, "content": msg.content} for msg in db_messages[:-1]] # exclude the newly added user message from history array parameter since it passes as current input
    history_context = context_builder.build_history_context(raw_history)
    
    # Load User Professional Profile to enrich memory context
    profile_model = await get_or_create_profile(db, user_id)
    profile_dto = ProfessionalProfileResponse.model_validate(profile_model)
    
    # 5. Execute LLM orchestration step (Timeline Ordering Step 3)
    start_time = time.perf_counter()
    ai_response = await orchestrator.run_step(
        goal=session.goal,
        profile=profile_dto,
        user_input=message_in.content,
        history=history_context
    )
    latency_ms = int((time.perf_counter() - start_time) * 1000)
    
    # 6. Persist AI Response (Timeline Ordering Step 4)
    db_ai_msg = Message(
        conversation_id=conversation.id,
        role=MessageRole.AI.value,
        input_type="TEXT",
        content=ai_response["content"],
        model_used=ai_response.get("model_used"),
        latency_ms=latency_ms,
        token_usage_prompt=ai_response.get("prompt_tokens"),
        token_usage_completion=ai_response.get("completion_tokens"),
        finish_reason=ai_response.get("finish_reason"),
        provider_name=ai_response.get("provider_name")
    )
    db.add(db_ai_msg)
    await db.commit()
    await db.refresh(db_ai_msg)
    
    return db_ai_msg
