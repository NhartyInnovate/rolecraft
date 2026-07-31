import pytest
from httpx import AsyncClient
import uuid

async def get_auth_headers(client: AsyncClient, email: str) -> dict:
    payload = {"email": email, "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    login_resp = await client.post("/api/v1/auth/login", data={"username": email, "password": "securepassword123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_session_lifecycle(client: AsyncClient):
    headers = await get_auth_headers(client, "session@example.com")
    
    # 1. Create a session
    payload = {"goal": "CREATE_CV", "title": "My Software Engineer CV"}
    create_resp = await client.post("/api/v1/career-sessions", json=payload, headers=headers)
    assert create_resp.status_code == 201
    session = create_resp.json()
    assert session["title"] == "My Software Engineer CV"
    assert session["status"] == "CREATED"
    assert session["goal"] == "CREATE_CV"
    session_id = session["id"]

    # 2. Transition CREATED -> IN_PROGRESS
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "IN_PROGRESS"}, headers=headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "IN_PROGRESS"

    # 3. Transition IN_PROGRESS -> AWAITING_REVIEW
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "AWAITING_REVIEW"}, headers=headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "AWAITING_REVIEW"

    # 4. Transition AWAITING_REVIEW -> COMPLETED (should record completed_at)
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "COMPLETED"}, headers=headers)
    assert patch_resp.status_code == 200
    completed_data = patch_resp.json()
    assert completed_data["status"] == "COMPLETED"
    assert completed_data["completed_at"] is not None

    # 5. Transition COMPLETED -> ARCHIVED
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "ARCHIVED"}, headers=headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["status"] == "ARCHIVED"

@pytest.mark.asyncio
async def test_invalid_lifecycle_transition(client: AsyncClient):
    headers = await get_auth_headers(client, "transition@example.com")
    
    # Create session (status starts as CREATED)
    create_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = create_resp.json()["id"]

    # Try transitioning directly CREATED -> COMPLETED (Invalid)
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "COMPLETED"}, headers=headers)
    assert patch_resp.status_code == 400
    assert "Invalid state transition" in patch_resp.json()["detail"]

@pytest.mark.asyncio
async def test_archived_session_readonly(client: AsyncClient):
    headers = await get_auth_headers(client, "archived@example.com")
    
    # Create session
    create_resp = await client.post("/api/v1/career-sessions", json={"goal": "TAILOR_CV"}, headers=headers)
    session_id = create_resp.json()["id"]

    # Transition CREATED -> IN_PROGRESS -> ARCHIVED
    await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "IN_PROGRESS"}, headers=headers)
    await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "ARCHIVED"}, headers=headers)

    # Attempt to transition ARCHIVED -> COMPLETED (should be rejected since archived is read-only)
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "COMPLETED"}, headers=headers)
    assert patch_resp.status_code == 400
    assert "Archived sessions are read-only" in patch_resp.json()["detail"]

@pytest.mark.asyncio
async def test_session_ownership_enforcement(client: AsyncClient):
    headers_owner = await get_auth_headers(client, "owner@example.com")
    headers_attacker = await get_auth_headers(client, "attacker@example.com")
    
    # Create session
    create_resp = await client.post("/api/v1/career-sessions", json={"goal": "COVER_LETTER"}, headers=headers_owner)
    session_id = create_resp.json()["id"]

    # Attacker attempts to fetch the session details
    get_resp = await client.get(f"/api/v1/career-sessions/{session_id}", headers=headers_attacker)
    assert get_resp.status_code == 403
    assert "Not authorized" in get_resp.json()["detail"]

    # Attacker attempts to update the status
    patch_resp = await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "IN_PROGRESS"}, headers=headers_attacker)
    assert patch_resp.status_code == 403

    # Attacker attempts to delete the session
    del_resp = await client.delete(f"/api/v1/career-sessions/{session_id}", headers=headers_attacker)
    assert del_resp.status_code == 403

@pytest.mark.asyncio
async def test_list_and_delete_user_sessions(client: AsyncClient):
    headers = await get_auth_headers(client, "list_sessions@example.com")

    # Create two sessions
    await client.post("/api/v1/career-sessions", json={"goal": "CREATE_CV", "title": "S1"}, headers=headers)
    await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV", "title": "S2"}, headers=headers)

    # List sessions (tests list_user_sessions and order_by query logic)
    list_resp = await client.get("/api/v1/career-sessions", headers=headers)
    assert list_resp.status_code == 200
    sessions = list_resp.json()
    assert len(sessions) >= 2
    # Ensure ordered by created_at desc (S2 created after S1)
    assert sessions[0]["title"] == "S2"
    assert sessions[1]["title"] == "S1"

    # Delete session
    delete_id = sessions[0]["id"]
    del_resp = await client.delete(f"/api/v1/career-sessions/{delete_id}", headers=headers)
    assert del_resp.status_code == 204

    # Verify deleted
    list_resp = await client.get("/api/v1/career-sessions", headers=headers)
    assert not any(s["id"] == delete_id for s in list_resp.json())

@pytest.mark.asyncio
async def test_career_session_status_workflow(client: AsyncClient):
    headers = await get_auth_headers(client, "workflow_status@example.com")
    
    # 1. Create career session
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]
    
    # 2. Check initial status
    status_resp = await client.get(f"/api/v1/career-sessions/{session_id}/status", headers=headers)
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["document_uploaded"] is False
    assert status_data["pending_review"] is False
    assert status_data["draft_confirmed"] is False
    assert status_data["completion_percentage"] == 0

    # 3. Upload document (transient pending review)
    import io
    file_payload = {"file": ("my_resume.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf"), "application/pdf")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers
    )
    assert upload_resp.status_code == 201
    
    # Verify status changes to uploaded and pending review, progress is 20%
    status_resp = await client.get(f"/api/v1/career-sessions/{session_id}/status", headers=headers)
    status_data = status_resp.json()
    assert status_data["document_uploaded"] is True
    assert status_data["pending_review"] is True
    assert status_data["draft_confirmed"] is False
    assert status_data["completion_percentage"] == 20

    # 4. Confirm the draft
    confirm_payload = {
        "document_type": "cv",
        "content": upload_resp.json()["draft"]
    }
    confirm_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/confirm",
        json=confirm_payload,
        headers=headers
    )
    assert confirm_resp.status_code == 200

    # Verify status changes to confirmed and pending_review is False, progress is 40%
    status_resp = await client.get(f"/api/v1/career-sessions/{session_id}/status", headers=headers)
    status_data = status_resp.json()
    assert status_data["document_uploaded"] is True
    assert status_data["pending_review"] is False
    assert status_data["draft_confirmed"] is True
    assert status_data["completion_percentage"] == 40
