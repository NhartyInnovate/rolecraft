from pydantic import BaseModel, Field, HttpUrl
from datetime import date, datetime
import uuid

# Base Schemas
class WorkExperienceBase(BaseModel):
    company: str = Field(..., min_length=1, max_length=255)
    role: str = Field(..., min_length=1, max_length=255)
    start_date: date
    end_date: date | None = None
    description: str | None = Field(None, max_length=4000)

class EducationBase(BaseModel):
    institution: str = Field(..., min_length=1, max_length=255)
    degree: str = Field(..., min_length=1, max_length=255)
    graduation_year: int = Field(...)

class SkillBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    type: str = Field(..., min_length=1, max_length=50) # e.g. technical, soft, language, tool

class CertificationBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    issuer: str = Field(..., min_length=1, max_length=255)
    issue_date: date | None = None

class ProfessionalLinkBase(BaseModel):
    label: str = Field(..., min_length=1, max_length=100)
    url: str = Field(..., min_length=1, max_length=1024)

# Create Schemas
class WorkExperienceCreate(WorkExperienceBase):
    pass

class EducationCreate(EducationBase):
    pass

class SkillCreate(SkillBase):
    pass

class CertificationCreate(CertificationBase):
    pass

class ProfessionalLinkCreate(ProfessionalLinkBase):
    pass

# Response Schemas
class WorkExperienceResponse(WorkExperienceBase):
    id: uuid.UUID
    profile_id: uuid.UUID

    class Config:
        from_attributes = True

class EducationResponse(EducationBase):
    id: uuid.UUID
    profile_id: uuid.UUID

    class Config:
        from_attributes = True

class SkillResponse(SkillBase):
    id: uuid.UUID
    profile_id: uuid.UUID

    class Config:
        from_attributes = True

class CertificationResponse(CertificationBase):
    id: uuid.UUID
    profile_id: uuid.UUID

    class Config:
        from_attributes = True

class ProfessionalLinkResponse(ProfessionalLinkBase):
    id: uuid.UUID
    profile_id: uuid.UUID

    class Config:
        from_attributes = True

class ProfessionalProfileBase(BaseModel):
    headline: str | None = Field(None, max_length=255)
    summary: str | None = Field(None, max_length=2000)
    years_of_experience: int | None = Field(None, ge=0)
    full_name: str | None = Field(None, max_length=255)
    phone: str | None = Field(None, max_length=50)
    location: str | None = Field(None, max_length=255)
    linkedin_url: str | None = Field(None, max_length=1024)
    github_url: str | None = Field(None, max_length=1024)
    portfolio_url: str | None = Field(None, max_length=1024)
    personal_website: str | None = Field(None, max_length=1024)
    profile_photo_url: str | None = Field(None, max_length=1024)

class ProfessionalProfileUpdate(ProfessionalProfileBase):
    pass

class ProfessionalProfileResponse(ProfessionalProfileBase):
    id: uuid.UUID
    user_id: uuid.UUID
    email: str | None = None
    last_synced_from_cv_at: datetime | None = None
    work_experiences: list[WorkExperienceResponse] = []
    educations: list[EducationResponse] = []
    skills: list[SkillResponse] = []
    certifications: list[CertificationResponse] = []
    links: list[ProfessionalLinkResponse] = []

    class Config:
        from_attributes = True
