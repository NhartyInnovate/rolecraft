import pytest
from httpx import AsyncClient
import uuid
from backend.conversations.models import Message
from sqlalchemy import select

async def get_auth_headers(client: AsyncClient, email: str) -> dict:
    payload = {"email": email, "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    login_resp = await client.post("/api/v1/auth/login", data={"username": email, "password": "securepassword123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_conversation_persistence_and_order(client: AsyncClient, db_session):
    headers = await get_auth_headers(client, "chat@example.com")
    
    # Create career session
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "CREATE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]

    # Submit user message (should trigger: user write, LLM run, AI write in order)
    msg_payload = {"content": "Hello, I want to create a new CV", "input_type": "TEXT"}
    response = await client.post(f"/api/v1/career-sessions/{session_id}/conversation/messages", json=msg_payload, headers=headers)
    assert response.status_code == 201
    ai_msg = response.json()
    assert ai_msg["role"] == "AI"
    assert ai_msg["provider_name"] == "MockProvider" # Mock LLM provider validation
    
    # Verify timeline ordering in database
    result = await db_session.execute(
        select(Message).order_by(Message.created_at.asc())
    )
    db_messages = result.scalars().all()
    assert len(db_messages) >= 2
    
    # User message first, AI response second
    user_msg_db = db_messages[-2]
    ai_msg_db = db_messages[-1]
    
    assert user_msg_db.role == "USER"
    assert user_msg_db.content == "Hello, I want to create a new CV"
    assert ai_msg_db.role == "AI"
    assert ai_msg_db.latency_ms is not None

@pytest.mark.asyncio
async def test_archived_session_rejects_chat(client: AsyncClient):
    headers = await get_auth_headers(client, "chat_archive@example.com")
    
    # Create and archive session
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "CREATE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]
    await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "IN_PROGRESS"}, headers=headers)
    await client.patch(f"/api/v1/career-sessions/{session_id}/status", json={"status": "ARCHIVED"}, headers=headers)

    # Attempt post message in archived session (should fail)
    response = await client.post(
        f"/api/v1/career-sessions/{session_id}/conversation/messages",
        json={"content": "Can we update my CV?", "input_type": "TEXT"},
        headers=headers
    )
    assert response.status_code == 400
    assert "Archived sessions are read-only" in response.json()["detail"]
