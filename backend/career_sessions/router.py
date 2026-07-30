from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from backend.core.db import get_db
from backend.auth.dependencies import get_current_user
from backend.users.models import User
from backend.career_sessions.schemas import (
    CareerSessionResponse,
    CareerSessionCreate,
    CareerSessionUpdateStatus
)
from backend.career_sessions.services import (
    create_session,
    get_session_by_id,
    list_user_sessions,
    update_session_status,
    delete_session
)

router = APIRouter(prefix="/career-sessions", tags=["Career Sessions"])

@router.post("", response_model=CareerSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_new_session(
    session_in: CareerSessionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await create_session(db, current_user.id, session_in)

@router.get("", response_model=list[CareerSessionResponse])
async def get_my_sessions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await list_user_sessions(db, current_user.id)

@router.get("/{session_id}", response_model=CareerSessionResponse)
async def get_session_details(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_session_by_id(db, current_user.id, session_id)

@router.patch("/{session_id}/status", response_model=CareerSessionResponse)
async def update_status(
    session_id: uuid.UUID,
    update_in: CareerSessionUpdateStatus,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await update_session_status(db, current_user.id, session_id, update_in.status)

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_session(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await delete_session(db, current_user.id, session_id)
