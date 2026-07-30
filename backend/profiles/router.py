from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
from backend.core.db import get_db
from backend.auth.dependencies import get_current_user
from backend.users.models import User
from backend.profiles.schemas import (
    ProfessionalProfileResponse,
    ProfessionalProfileUpdate,
    WorkExperienceResponse,
    WorkExperienceCreate,
    EducationResponse,
    EducationCreate,
    SkillResponse,
    SkillCreate,
    CertificationResponse,
    CertificationCreate,
    ProfessionalLinkResponse,
    ProfessionalLinkCreate
)
from backend.profiles.services import (
    get_or_create_profile,
    update_profile,
    add_work_experience,
    delete_work_experience,
    add_education,
    delete_education,
    add_skill,
    delete_skill,
    add_certification,
    delete_certification,
    add_link,
    delete_link
)

router = APIRouter(prefix="/profile", tags=["Professional Profile"])

# Profile endpoints
@router.get("", response_model=ProfessionalProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await get_or_create_profile(db, current_user.id)

@router.put("", response_model=ProfessionalProfileResponse)
async def update_user_profile(
    profile_in: ProfessionalProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await update_profile(db, current_user.id, profile_in)

# Nested Work Experience
@router.post("/experience", response_model=WorkExperienceResponse, status_code=status.HTTP_201_CREATED)
async def create_experience(
    exp_in: WorkExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await add_work_experience(db, current_user.id, exp_in)

@router.delete("/experience/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_experience(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await delete_work_experience(db, current_user.id, id)

# Nested Education
@router.post("/education", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
async def create_education(
    edu_in: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await add_education(db, current_user.id, edu_in)

@router.delete("/education/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_education(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await delete_education(db, current_user.id, id)

# Nested Skills
@router.post("/skills", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill_in: SkillCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await add_skill(db, current_user.id, skill_in)

@router.delete("/skills/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_skill(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await delete_skill(db, current_user.id, id)

# Nested Certifications
@router.post("/certifications", response_model=CertificationResponse, status_code=status.HTTP_201_CREATED)
async def create_certification(
    cert_in: CertificationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await add_certification(db, current_user.id, cert_in)

@router.delete("/certifications/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_certification(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await delete_certification(db, current_user.id, id)

# Nested Links
@router.post("/links", response_model=ProfessionalLinkResponse, status_code=status.HTTP_201_CREATED)
async def create_link(
    link_in: ProfessionalLinkCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    return await add_link(db, current_user.id, link_in)

@router.delete("/links/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_link(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await delete_link(db, current_user.id, id)
