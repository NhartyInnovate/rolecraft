from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from datetime import datetime, date
import uuid

from backend.profiles.models import (
    ProfessionalProfile,
    WorkExperience,
    Education,
    Skill,
    Certification,
    ProfessionalLink
)
from backend.profiles.schemas import (
    ProfessionalProfileUpdate,
    WorkExperienceCreate,
    EducationCreate,
    SkillCreate,
    CertificationCreate,
    ProfessionalLinkCreate
)

# ----------------- PROFILE CORE -----------------

async def get_or_create_profile(db: AsyncSession, user_id: uuid.UUID) -> ProfessionalProfile:
    # Fetch with selectinload to eagerly load nested children
    result = await db.execute(
        select(ProfessionalProfile)
        .where(ProfessionalProfile.user_id == user_id)
        .options(
            selectinload(ProfessionalProfile.work_experiences),
            selectinload(ProfessionalProfile.educations),
            selectinload(ProfessionalProfile.skills),
            selectinload(ProfessionalProfile.certifications),
            selectinload(ProfessionalProfile.links)
        )
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        profile = ProfessionalProfile(user_id=user_id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        # Re-fetch with loads to make sure relationships lists are initialized
        result = await db.execute(
            select(ProfessionalProfile)
            .where(ProfessionalProfile.user_id == user_id)
            .options(
                selectinload(ProfessionalProfile.work_experiences),
                selectinload(ProfessionalProfile.educations),
                selectinload(ProfessionalProfile.skills),
                selectinload(ProfessionalProfile.certifications),
                selectinload(ProfessionalProfile.links)
            )
        )
        profile = result.scalar_one()
        
    return profile

async def update_profile(db: AsyncSession, user_id: uuid.UUID, profile_in: ProfessionalProfileUpdate) -> ProfessionalProfile:
    profile = await get_or_create_profile(db, user_id)
    
    # Validation
    if profile_in.headline is not None and profile_in.headline.strip() == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Headline cannot be empty string.")
    if profile_in.summary is not None and profile_in.summary.strip() == "":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Summary cannot be empty string.")
    
    profile.headline = profile_in.headline
    profile.summary = profile_in.summary
    profile.years_of_experience = profile_in.years_of_experience
    
    await db.commit()
    await db.refresh(profile)
    return profile

# Helper function to load profile and enforce user ownership validation
async def get_profile_and_verify_ownership(db: AsyncSession, profile_id: uuid.UUID, user_id: uuid.UUID) -> ProfessionalProfile:
    result = await db.execute(select(ProfessionalProfile).where(ProfessionalProfile.id == profile_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")
    if profile.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this profile.")
    return profile

# ----------------- WORK EXPERIENCES -----------------

async def add_work_experience(db: AsyncSession, user_id: uuid.UUID, exp_in: WorkExperienceCreate) -> WorkExperience:
    profile = await get_or_create_profile(db, user_id)
    
    # Business Validations
    if not exp_in.company.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Company name cannot be empty.")
    if not exp_in.role.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Role description cannot be empty.")
    if exp_in.end_date and exp_in.end_date < exp_in.start_date:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="End date cannot precede start date.")
        
    db_exp = WorkExperience(
        profile_id=profile.id,
        company=exp_in.company,
        role=exp_in.role,
        start_date=exp_in.start_date,
        end_date=exp_in.end_date,
        description=exp_in.description
    )
    db.add(db_exp)
    await db.commit()
    await db.refresh(db_exp)
    return db_exp

async def delete_work_experience(db: AsyncSession, user_id: uuid.UUID, exp_id: uuid.UUID):
    result = await db.execute(select(WorkExperience).where(WorkExperience.id == exp_id))
    db_exp = result.scalar_one_or_none()
    if not db_exp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Work experience not found.")
        
    # Ownership Check
    await get_profile_and_verify_ownership(db, db_exp.profile_id, user_id)
    
    await db.delete(db_exp)
    await db.commit()

# ----------------- EDUCATIONS -----------------

async def add_education(db: AsyncSession, user_id: uuid.UUID, edu_in: EducationCreate) -> Education:
    profile = await get_or_create_profile(db, user_id)
    
    # Business Validations
    if not edu_in.institution.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Institution cannot be empty.")
    if not edu_in.degree.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Degree cannot be empty.")
    
    current_year = datetime.now().year
    if edu_in.graduation_year < 1900 or edu_in.graduation_year > current_year + 10:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid graduation year.")
        
    db_edu = Education(
        profile_id=profile.id,
        institution=edu_in.institution,
        degree=edu_in.degree,
        graduation_year=edu_in.graduation_year
    )
    db.add(db_edu)
    await db.commit()
    await db.refresh(db_edu)
    return db_edu

async def delete_education(db: AsyncSession, user_id: uuid.UUID, edu_id: uuid.UUID):
    result = await db.execute(select(Education).where(Education.id == edu_id))
    db_edu = result.scalar_one_or_none()
    if not db_edu:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Education record not found.")
        
    # Ownership Check
    await get_profile_and_verify_ownership(db, db_edu.profile_id, user_id)
    
    await db.delete(db_edu)
    await db.commit()

# ----------------- SKILLS -----------------

async def add_skill(db: AsyncSession, user_id: uuid.UUID, skill_in: SkillCreate) -> Skill:
    profile = await get_or_create_profile(db, user_id)
    
    # Business Validations
    cleaned_name = skill_in.name.strip()
    if not cleaned_name:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill name cannot be empty.")
        
    # Check duplicate skill name (case insensitive check)
    result = await db.execute(
        select(Skill).where(
            Skill.profile_id == profile.id,
            Skill.name.ilike(cleaned_name)
        )
    )
    if result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Skill already exists on this profile.")
        
    db_skill = Skill(
        profile_id=profile.id,
        name=cleaned_name,
        type=skill_in.type
    )
    db.add(db_skill)
    await db.commit()
    await db.refresh(db_skill)
    return db_skill

async def delete_skill(db: AsyncSession, user_id: uuid.UUID, skill_id: uuid.UUID):
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    db_skill = result.scalar_one_or_none()
    if not db_skill:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill not found.")
        
    # Ownership Check
    await get_profile_and_verify_ownership(db, db_skill.profile_id, user_id)
    
    await db.delete(db_skill)
    await db.commit()

# ----------------- CERTIFICATIONS -----------------

async def add_certification(db: AsyncSession, user_id: uuid.UUID, cert_in: CertificationCreate) -> Certification:
    profile = await get_or_create_profile(db, user_id)
    
    # Business Validations
    if not cert_in.name.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Certification name cannot be empty.")
    if not cert_in.issuer.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Issuer cannot be empty.")
        
    db_cert = Certification(
        profile_id=profile.id,
        name=cert_in.name,
        issuer=cert_in.issuer,
        issue_date=cert_in.issue_date
    )
    db.add(db_cert)
    await db.commit()
    await db.refresh(db_cert)
    return db_cert

async def delete_certification(db: AsyncSession, user_id: uuid.UUID, cert_id: uuid.UUID):
    result = await db.execute(select(Certification).where(Certification.id == cert_id))
    db_cert = result.scalar_one_or_none()
    if not db_cert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Certification not found.")
        
    # Ownership Check
    await get_profile_and_verify_ownership(db, db_cert.profile_id, user_id)
    
    await db.delete(db_cert)
    await db.commit()

# ----------------- LINKS -----------------

async def add_link(db: AsyncSession, user_id: uuid.UUID, link_in: ProfessionalLinkCreate) -> ProfessionalLink:
    profile = await get_or_create_profile(db, user_id)
    
    # Business Validations
    if not link_in.label.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Link label cannot be empty.")
    if not link_in.url.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="URL cannot be empty.")
        
    db_link = ProfessionalLink(
        profile_id=profile.id,
        label=link_in.label,
        url=link_in.url
    )
    db.add(db_link)
    await db.commit()
    await db.refresh(db_link)
    return db_link

async def delete_link(db: AsyncSession, user_id: uuid.UUID, link_id: uuid.UUID):
    result = await db.execute(select(ProfessionalLink).where(ProfessionalLink.id == link_id))
    db_link = result.scalar_one_or_none()
    if not db_link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found.")
        
    # Ownership Check
    await get_profile_and_verify_ownership(db, db_link.profile_id, user_id)
    
    await db.delete(db_link)
    await db.commit()
