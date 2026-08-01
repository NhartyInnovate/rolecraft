import pytest
from httpx import AsyncClient
import uuid
import io
from datetime import datetime, timezone
from backend.profiles.models import ProfessionalProfile
from sqlalchemy import select

async def get_auth_headers(client: AsyncClient, email: str) -> dict:
    payload = {"email": email, "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    login_resp = await client.post("/api/v1/auth/login", data={"username": email, "password": "securepassword123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_profile_sync_on_confirm(client: AsyncClient, mocker):
    headers = await get_auth_headers(client, "profile_sync@example.com")
    
    # 1. Create a career session
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]

    # 2. Mock LLM extraction returning personal_info containing custom links
    mocker.patch(
        "backend.ai.services.llm_service.LLMService.generate_chat_response",
        return_value={
            "content": '{"personal_info": {"name": {"value": "John Doe Jr", "confidence": 0.9}, "email": {"value": "john_jr@example.com", "confidence": 0.9}, "phone": {"value": "+123456", "confidence": 0.9}, "location": {"value": "Abuja", "confidence": 0.9}, "linkedin_url": {"value": "https://linkedin.com/in/johndoe", "confidence": 0.9}, "github_url": {"value": "https://github.com/johndoe", "confidence": 0.9}}, "headline": {"value": "Lead Architect", "confidence": 0.9}, "summary": {"value": "Passionate developer.", "confidence": 0.9}, "experience": [], "education": [], "skills": [], "projects": [], "certifications": []}',
            "model_used": "mock-gpt-model",
            "prompt_tokens": 100,
            "completion_tokens": 50,
            "finish_reason": "stop",
            "provider_name": "MockProvider"
        }
    )

    # 3. Upload file
    file_payload = {"file": ("my_resume.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf"), "application/pdf")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers
    )
    assert upload_resp.status_code == 201
    draft_content = upload_resp.json()["draft"]

    # 4. Initially, profile should be empty or have nulls
    profile_resp = await client.get("/api/v1/profile", headers=headers)
    assert profile_resp.status_code == 200
    initial_profile = profile_resp.json()
    assert initial_profile["full_name"] is None
    assert initial_profile["email"] == "profile_sync@example.com"  # Dynamically loaded from user relation

    # 5. Confirm the draft (should trigger synchronization)
    confirm_payload = {
        "document_type": "cv",
        "content": draft_content
    }
    confirm_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/confirm",
        json=confirm_payload,
        headers=headers
    )
    assert confirm_resp.status_code == 200

    # 6. Fetch profile and verify synchronized values
    profile_resp = await client.get("/api/v1/profile", headers=headers)
    assert profile_resp.status_code == 200
    synced_profile = profile_resp.json()
    assert synced_profile["full_name"] == "John Doe Jr"
    assert synced_profile["headline"] == "Lead Architect"
    assert synced_profile["phone"] == "+123456"
    assert synced_profile["location"] == "Abuja"
    assert synced_profile["linkedin_url"] == "https://linkedin.com/in/johndoe"
    assert synced_profile["github_url"] == "https://github.com/johndoe"
    assert synced_profile["last_synced_from_cv_at"] is not None

    # 7. Modify a field manually on the profile (e.g. name changed to Jane Doe)
    update_payload = {
        "headline": "Lead Architect",
        "full_name": "Jane Doe"
    }
    update_resp = await client.put("/api/v1/profile", json=update_payload, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["full_name"] == "Jane Doe"

    # 8. Re-trigger sync with the same CV content (idempotency check & preserve manual edits check)
    from backend.profiles.services import sync_from_confirmed_cv
    # Run sync again, name should NOT change from Jane Doe to John Doe Jr
    confirm_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/confirm",
        json=confirm_payload,
        headers=headers
    )
    assert confirm_resp.status_code == 200

    profile_resp = await client.get("/api/v1/profile", headers=headers)
    final_profile = profile_resp.json()
    assert final_profile["full_name"] == "Jane Doe"  # Preserved manual edit
    assert final_profile["headline"] == "Lead Architect"  # Kept headline
