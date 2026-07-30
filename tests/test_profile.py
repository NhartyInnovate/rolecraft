import pytest
from httpx import AsyncClient
import uuid
from datetime import date
from backend.profiles.models import ProfessionalProfile
from sqlalchemy import select

# Eagerly register two distinct users helper
async def get_auth_headers(client: AsyncClient, email: str) -> dict:
    payload = {"email": email, "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    login_resp = await client.post("/api/v1/auth/login", data={"username": email, "password": "securepassword123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_get_and_update_profile(client: AsyncClient):
    headers = await get_auth_headers(client, "profile@example.com")
    
    # Get Profile (should create automatically)
    response = await client.get("/api/v1/profile", headers=headers)
    assert response.status_code == 200
    profile_data = response.json()
    assert profile_data["headline"] is None
    
    # Update profile fields
    update_payload = {
        "headline": "Lead Software Architect",
        "summary": "Experienced python developer.",
        "years_of_experience": 10
    }
    update_response = await client.put("/api/v1/profile", json=update_payload, headers=headers)
    assert update_response.status_code == 200
    updated_data = update_response.json()
    assert updated_data["headline"] == "Lead Software Architect"
    assert updated_data["years_of_experience"] == 10

@pytest.mark.asyncio
async def test_validation_failures_empty_strings(client: AsyncClient):
    headers = await get_auth_headers(client, "validation@example.com")
    
    # Update profile with empty string spaces headline
    update_payload = {
        "headline": "   ",
        "summary": "Valid summary.",
        "years_of_experience": 2
    }
    response = await client.put("/api/v1/profile", json=update_payload, headers=headers)
    assert response.status_code == 400
    assert "Headline cannot be empty" in response.json()["detail"]

@pytest.mark.asyncio
async def test_experience_date_validation(client: AsyncClient):
    headers = await get_auth_headers(client, "dateval@example.com")
    
    # End date before start date
    payload = {
        "company": "Tech Corp",
        "role": "Developer",
        "start_date": "2024-01-01",
        "end_date": "2023-01-01",
        "description": "Short duration."
    }
    response = await client.post("/api/v1/profile/experience", json=payload, headers=headers)
    assert response.status_code == 400
    assert "End date cannot precede start date" in response.json()["detail"]

@pytest.mark.asyncio
async def test_education_graduation_year_validation(client: AsyncClient):
    headers = await get_auth_headers(client, "gradval@example.com")
    
    payload = {
        "institution": "University of Science",
        "degree": "BSc Computer Science",
        "graduation_year": 1850 # unrealistic year
    }
    response = await client.post("/api/v1/profile/education", json=payload, headers=headers)
    assert response.status_code == 400
    assert "Invalid graduation year" in response.json()["detail"]

@pytest.mark.asyncio
async def test_duplicate_skills_rejection(client: AsyncClient):
    headers = await get_auth_headers(client, "skills@example.com")
    
    payload = {"name": "Python", "type": "technical"}
    resp1 = await client.post("/api/v1/profile/skills", json=payload, headers=headers)
    assert resp1.status_code == 201
    
    # Try adding identical skill (case insensitive)
    resp2 = await client.post("/api/v1/profile/skills", json={"name": "  python  ", "type": "technical"}, headers=headers)
    assert resp2.status_code == 400
    assert "already exists" in resp2.json()["detail"]

@pytest.mark.asyncio
async def test_ownership_enforcement(client: AsyncClient, db_session):
    headers_user1 = await get_auth_headers(client, "user1@example.com")
    headers_user2 = await get_auth_headers(client, "user2@example.com")
    
    # User 1 creates skill
    resp_skill = await client.post("/api/v1/profile/skills", json={"name": "FastAPI", "type": "technical"}, headers=headers_user1)
    assert resp_skill.status_code == 201
    skill_id = resp_skill.json()["id"]
    
    # User 2 attempts to delete User 1's skill
    resp_delete = await client.delete(f"/api/v1/profile/skills/{skill_id}", headers=headers_user2)
    assert resp_delete.status_code == 403
    assert "Not authorized" in resp_delete.json()["detail"]

@pytest.mark.asyncio
async def test_cascade_delete_behavior(client: AsyncClient, db_session):
    headers = await get_auth_headers(client, "cascade@example.com")
    
    # Add education
    edu_resp = await client.post("/api/v1/profile/education", json={
        "institution": "MIT",
        "degree": "Ph.D.",
        "graduation_year": 2026
    }, headers=headers)
    assert edu_resp.status_code == 201
    profile_id = edu_resp.json()["profile_id"]
    
    # Fetch profile manually and verify relations exist in database
    result = await db_session.execute(select(ProfessionalProfile).where(ProfessionalProfile.id == uuid.UUID(profile_id)))
    profile = result.scalar_one()
    assert profile is not None
    
    # Delete Profile via cascade context deletion
    await db_session.delete(profile)
    await db_session.commit()
    
    # Verify child education entity is gone (orphaned cascade)
    from backend.profiles.models import Education
    result_edu = await db_session.execute(select(Education).where(Education.profile_id == uuid.UUID(profile_id)))
    assert result_edu.scalar_one_or_none() is None
