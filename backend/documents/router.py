from fastapi import APIRouter, Depends, UploadFile, File, status, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import os
from backend.core.db import get_db
from backend.auth.dependencies import get_current_user
from backend.users.models import User
from backend.documents.schemas import (
    UploadedCVResponse, CVDraftResponse, CVDraftUpdate, ExportResponse,
    CVPendingReviewResponse, DocumentConfirmRequest
)
from backend.documents.services import (
    process_file_upload,
    get_cv_draft,
    save_or_update_cv_draft,
    compile_cv_export,
    confirm_document_draft
)

router = APIRouter(prefix="/career-sessions", tags=["Documents & Exports"])

@router.post("/{session_id}/documents/upload", response_model=CVPendingReviewResponse, status_code=status.HTTP_201_CREATED)
async def upload_cv_document(
    session_id: uuid.UUID,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await process_file_upload(db, current_user.id, session_id, file)

@router.post("/{session_id}/documents/confirm", response_model=CVDraftResponse)
async def confirm_session_document_draft(
    session_id: uuid.UUID,
    confirm_in: DocumentConfirmRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await confirm_document_draft(db, current_user.id, session_id, confirm_in.document_type, confirm_in.content)

@router.get("/{session_id}/cv-draft", response_model=CVDraftResponse)
async def get_session_cv_draft(
    session_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_cv_draft(db, current_user.id, session_id)

@router.put("/{session_id}/cv-draft", response_model=CVDraftResponse)
async def update_session_cv_draft(
    session_id: uuid.UUID,
    draft_in: CVDraftUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await save_or_update_cv_draft(db, current_user.id, session_id, draft_in.content)

@router.post("/{session_id}/exports/cv", response_model=ExportResponse, status_code=status.HTTP_201_CREATED)
async def create_cv_export(
    session_id: uuid.UUID,
    file_type: str, # PDF or DOCX
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if file_type.upper() not in {"PDF", "DOCX"}:
        raise HTTPException(status_code=400, detail="Invalid export type. Must be PDF or DOCX.")
    return await compile_cv_export(db, current_user.id, session_id, file_type)

@router.get("/{session_id}/exports/{export_id}", response_class=FileResponse)
async def download_file_export(
    session_id: uuid.UUID,
    export_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Verify aggregate ownership first
    from backend.career_sessions.services import get_session_by_id
    await get_session_by_id(db, current_user.id, session_id)
    
    from backend.documents.models import Export
    result = await db.execute(select(Export).where(Export.id == export_id, Export.career_session_id == session_id))
    db_export = result.scalar_one_or_none()
    if not db_export:
        raise HTTPException(status_code=404, detail="Exported file not found.")
        
    if not os.path.exists(db_export.storage_path):
        raise HTTPException(status_code=404, detail="Physical file missing from storage.")
        
    filename = f"CV_Export_{session_id}{os.path.splitext(db_export.storage_path)[1]}"
    media_type = "application/pdf" if db_export.file_type.upper() == "PDF" else "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return FileResponse(db_export.storage_path, filename=filename, media_type=media_type)

# Helper select import since SQL dependencies are dynamic
from sqlalchemy import select
