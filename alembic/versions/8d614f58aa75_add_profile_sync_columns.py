"""add_profile_sync_columns

Revision ID: 8d614f58aa75
Revises: f3ec6e50f5d7
Create Date: 2026-08-01 17:22:36.249534

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8d614f58aa75'
down_revision: Union[str, Sequence[str], None] = 'f3ec6e50f5d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('professional_profiles', sa.Column('full_name', sa.String(length=255), nullable=True))
    op.add_column('professional_profiles', sa.Column('phone', sa.String(length=50), nullable=True))
    op.add_column('professional_profiles', sa.Column('location', sa.String(length=255), nullable=True))
    op.add_column('professional_profiles', sa.Column('linkedin_url', sa.String(length=1024), nullable=True))
    op.add_column('professional_profiles', sa.Column('github_url', sa.String(length=1024), nullable=True))
    op.add_column('professional_profiles', sa.Column('portfolio_url', sa.String(length=1024), nullable=True))
    op.add_column('professional_profiles', sa.Column('personal_website', sa.String(length=1024), nullable=True))
    op.add_column('professional_profiles', sa.Column('profile_photo_url', sa.String(length=1024), nullable=True))
    op.add_column('professional_profiles', sa.Column('last_synced_from_cv_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('professional_profiles', 'last_synced_from_cv_at')
    op.drop_column('professional_profiles', 'profile_photo_url')
    op.drop_column('professional_profiles', 'personal_website')
    op.drop_column('professional_profiles', 'portfolio_url')
    op.drop_column('professional_profiles', 'github_url')
    op.drop_column('professional_profiles', 'linkedin_url')
    op.drop_column('professional_profiles', 'location')
    op.drop_column('professional_profiles', 'phone')
    op.drop_column('professional_profiles', 'full_name')
