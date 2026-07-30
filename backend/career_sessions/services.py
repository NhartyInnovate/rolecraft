from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from datetime import datetime, timezone
import uuid

from backend.career_sessions.models import CareerSession
from backend.career_sessions.schemas import CareerSessionCreate, SessionGoal, SessionStatus

# Valid transition mappings
ALLOWED_TRANSITIONS = {
    SessionStatus.CREATED: {SessionStatus.IN_PROGRESS},
    SessionStatus.IN_PROGRESS: {SessionStatus.AWAITING_REVIEW, SessionStatus.ARCHIVED},
    SessionStatus.AWAITING_REVIEW: {SessionStatus.COMPLETED, SessionStatus.ARCHIVED},
    SessionStatus.COMPLETED: {SessionStatus.ARCHIVED},
    SessionStatus.ARCHIVED: set() # Terminal read-only state
}

async def create_session(db: AsyncSession, user_id: uuid.UUID, session_in: CareerSessionCreate) -> CareerSession:
    title = session_in.title
    if not title or not title.strip():
        # Fallback to display description of the goal
        title = session_in.goal.value.replace("_", " ").title()
        
    db_session = CareerSession(
        user_id=user_id,
        title=title,
        goal=session_in.goal.value,
        status=SessionStatus.CREATED.value
    )
    db.add(db_session)
    await db.commit()
    await db.refresh(db_session)
    return db_session

async def get_session_by_id(db: AsyncSession, user_id: uuid.UUID, session_id: uuid.UUID) -> CareerSession:
    result = await db.execute(select(CareerSession).where(CareerSession.id == session_id))
    db_session = result.scalar_one_or_none()
    
    if not db_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Career Session not found.")
        
    # Enforce ownership in the service layer
    if db_session.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this session.")
        
    return db_session

async def list_user_sessions(db: AsyncSession, user_id: uuid.UUID) -> list[CareerSession]:
    result = await db.execute(
        select(CareerSession)
        .where(CareerSession.user_id == user_id)
        .order_on(CareerSession.created_at.desc()) if hasattr(CareerSession, "created_at") else select(CareerSession).where(CareerSession.user_id == user_id)
    )
    # Simple order by fallback
    result = await db.execute(select(CareerSession).where(CareerSession.user_id == user_id))
    return list(result.scalars().all())

async def update_session_status(
    db: AsyncSession,
    user_id: uuid.UUID,
    session_id: uuid.UUID,
    new_status: SessionStatus
) -> CareerSession:
    db_session = await get_session_by_id(db, user_id, session_id)
    
    current_status = SessionStatus(db_session.status)
    
    # 1. Enforce Archived sessions are read-only
    if current_status == SessionStatus.ARCHIVED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Archived sessions are read-only and cannot be updated."
        )
        
    # 2. Validate Transitions
    allowed = ALLOWED_TRANSITIONS.get(current_status, set())
    if new_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid state transition: {current_status.value} to {new_status.value} is not allowed."
        )
        
    # Apply change
    db_session.status = new_status.value
    
    # Apply completion timestamping
    if new_status == SessionStatus.COMPLETED:
        db_session.completed_at = datetime.now(timezone.utc)
        
    await db.commit()
    await db.refresh(db_session)
    return db_session

async def delete_session(db: AsyncSession, user_id: uuid.UUID, session_id: uuid.UUID) -> None:
    db_session = await get_session_by_id(db, user_id, session_id)
    # All dependent child relations will delete via cascading configurations
    await db.delete(db_session)
    await db.commit()
