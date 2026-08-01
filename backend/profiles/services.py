from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from datetime import datetime, date, timezone
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
    profile.full_name = profile_in.full_name
    profile.phone = profile_in.phone
    profile.location = profile_in.location
    profile.linkedin_url = profile_in.linkedin_url
    profile.github_url = profile_in.github_url
    profile.portfolio_url = profile_in.portfolio_url
    profile.personal_website = profile_in.personal_website
    profile.profile_photo_url = profile_in.profile_photo_url
    
    await db.commit()
    await db.refresh(profile)
    return profile

async def sync_from_confirmed_cv(db: AsyncSession, user_id: uuid.UUID, cv_content: dict) -> None:
    profile = await get_or_create_profile(db, user_id)
    personal_info = cv_content.get("personal_info", {})
    
    # 1. full_name
    extracted_name = personal_info.get("name", {}).get("value") if isinstance(personal_info.get("name"), dict) else personal_info.get("name")
    if extracted_name and (not profile.full_name or profile.full_name.strip() == ""):
        profile.full_name = extracted_name.strip()
        
    # 2. headline
    extracted_headline = cv_content.get("headline", {}).get("value") if isinstance(cv_content.get("headline"), dict) else cv_content.get("headline")
    if extracted_headline and (not profile.headline or profile.headline.strip() == ""):
        profile.headline = extracted_headline.strip()
        
    # 3. phone
    extracted_phone = personal_info.get("phone", {}).get("value") if isinstance(personal_info.get("phone"), dict) else personal_info.get("phone")
    if extracted_phone and (not profile.phone or profile.phone.strip() == ""):
        profile.phone = extracted_phone.strip()
        
    # 4. location
    extracted_location = personal_info.get("location", {}).get("value") if isinstance(personal_info.get("location"), dict) else personal_info.get("location")
    if extracted_location and (not profile.location or profile.location.strip() == ""):
        profile.location = extracted_location.strip()
        
    # 5. linkedin_url
    extracted_linkedin = personal_info.get("linkedin_url", {}).get("value") if isinstance(personal_info.get("linkedin_url"), dict) else personal_info.get("linkedin_url")
    if not extracted_linkedin:
        extracted_linkedin = personal_info.get("linkedin", {}).get("value") if isinstance(personal_info.get("linkedin"), dict) else personal_info.get("linkedin")
    if extracted_linkedin and (not profile.linkedin_url or profile.linkedin_url.strip() == ""):
        profile.linkedin_url = extracted_linkedin.strip()
        
    # 6. github_url
    extracted_github = personal_info.get("github_url", {}).get("value") if isinstance(personal_info.get("github_url"), dict) else personal_info.get("github_url")
    if not extracted_github:
        extracted_github = personal_info.get("github", {}).get("value") if isinstance(personal_info.get("github"), dict) else personal_info.get("github")
    if extracted_github and (not profile.github_url or profile.github_url.strip() == ""):
        profile.github_url = extracted_github.strip()
        
    # 7. portfolio_url
    extracted_portfolio = personal_info.get("portfolio_url", {}).get("value") if isinstance(personal_info.get("portfolio_url"), dict) else personal_info.get("portfolio_url")
    if not extracted_portfolio:
        extracted_portfolio = personal_info.get("portfolio", {}).get("value") if isinstance(personal_info.get("portfolio"), dict) else personal_info.get("portfolio")
    if extracted_portfolio and (not profile.portfolio_url or profile.portfolio_url.strip() == ""):
        profile.portfolio_url = extracted_portfolio.strip()
        
    # 8. personal_website
    extracted_website = personal_info.get("personal_website", {}).get("value") if isinstance(personal_info.get("personal_website"), dict) else personal_info.get("personal_website")
    if not extracted_website:
        extracted_website = personal_info.get("website_url", {}).get("value") if isinstance(personal_info.get("website_url"), dict) else personal_info.get("website_url")
    if not extracted_website:
        extracted_website = personal_info.get("website", {}).get("value") if isinstance(personal_info.get("website"), dict) else personal_info.get("website")
    if extracted_website and (not profile.personal_website or profile.personal_website.strip() == ""):
        profile.personal_website = extracted_website.strip()
        
    # Update synchronization timestamp
    profile.last_synced_from_cv_at = datetime.now(timezone.utc)
    
    await db.commit()
    await db.refresh(profile)

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
