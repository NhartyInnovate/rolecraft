import uuid
from datetime import datetime, date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, ForeignKey, Date, DateTime
from backend.core.db import Base, TimestampMixin

class ProfessionalProfile(Base, TimestampMixin):
    __tablename__ = "professional_profiles"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    headline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    summary: Mapped[str | None] = mapped_column(String(2000), nullable=True)
    years_of_experience: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Sync fields
    full_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    portfolio_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    personal_website: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    profile_photo_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    last_synced_from_cv_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="profile")
    work_experiences = relationship("WorkExperience", back_populates="profile", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="profile", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="profile", cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="profile", cascade="all, delete-orphan")
    links = relationship("ProfessionalLink", back_populates="profile", cascade="all, delete-orphan")

    @property
    def email(self) -> str | None:
        return self.user.email if self.user else None

class WorkExperience(Base, TimestampMixin):
    __tablename__ = "work_experiences"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False)
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    description: Mapped[str | None] = mapped_column(String(4000), nullable=True)

    # Relationships
    profile = relationship("ProfessionalProfile", back_populates="work_experiences")

class Education(Base, TimestampMixin):
    __tablename__ = "educations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False)
    institution: Mapped[str] = mapped_column(String(255), nullable=False)
    degree: Mapped[str] = mapped_column(String(255), nullable=False)
    graduation_year: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    profile = relationship("ProfessionalProfile", back_populates="educations")

class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. technical, soft, language, tool

    # Relationships
    profile = relationship("ProfessionalProfile", back_populates="skills")

class Certification(Base, TimestampMixin):
    __tablename__ = "certifications"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    issuer: Mapped[str] = mapped_column(String(255), nullable=False)
    issue_date: Mapped[date | None] = mapped_column(Date, nullable=True)

    # Relationships
    profile = relationship("ProfessionalProfile", back_populates="certifications")

class ProfessionalLink(Base, TimestampMixin):
    __tablename__ = "professional_links"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    profile_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("professional_profiles.id", ondelete="CASCADE"), nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., 'LinkedIn', 'GitHub', 'Portfolio'
    url: Mapped[str] = mapped_column(String(1024), nullable=False)

    # Relationships
    profile = relationship("ProfessionalProfile", back_populates="links")
