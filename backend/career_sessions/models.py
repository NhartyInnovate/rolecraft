import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime
from backend.core.db import Base, TimestampMixin

class CareerSession(Base, TimestampMixin):
    __tablename__ = "career_sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    goal: Mapped[str] = mapped_column(String(50), nullable=False)  # CREATE_CV, IMPROVE_CV, TAILOR_CV, COVER_LETTER
    status: Mapped[str] = mapped_column(String(50), default="CREATED", nullable=False)  # CREATED, IN_PROGRESS, AWAITING_REVIEW, COMPLETED, ARCHIVED
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="sessions")
    uploaded_cv = relationship("UploadedCV", back_populates="career_session", uselist=False, cascade="all, delete-orphan")
    cv_draft = relationship("CVDraft", back_populates="career_session", uselist=False, cascade="all, delete-orphan")
    cover_letter_draft = relationship("CoverLetterDraft", back_populates="career_session", uselist=False, cascade="all, delete-orphan")
    exports = relationship("Export", back_populates="career_session", cascade="all, delete-orphan")
