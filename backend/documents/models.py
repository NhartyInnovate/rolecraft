import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime, Integer, Text, JSON
from backend.core.db import Base, TimestampMixin

class UploadedCV(Base, TimestampMixin):
    __tablename__ = "uploaded_cvs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    career_session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_sessions.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(1024), nullable=False)
    extracted_text: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    career_session = relationship("CareerSession", back_populates="uploaded_cv")

class CVDraft(Base, TimestampMixin):
    __tablename__ = "cv_drafts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    career_session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_sessions.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    content: Mapped[dict] = mapped_column(JSON, nullable=False) # Stores JSON CV schema
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    # Relationships
    career_session = relationship("CareerSession", back_populates="cv_draft")

class CoverLetterDraft(Base, TimestampMixin):
    __tablename__ = "cover_letter_drafts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    career_session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_sessions.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)

    # Relationships
    career_session = relationship("CareerSession", back_populates="cover_letter_draft")

class Export(Base, TimestampMixin):
    __tablename__ = "exports"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    career_session_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("career_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False) # PDF, DOCX
    storage_path: Mapped[str] = mapped_column(String(1024), nullable=False)

    # Relationships
    career_session = relationship("CareerSession", back_populates="exports")
