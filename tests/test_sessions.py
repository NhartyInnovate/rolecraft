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
