import pytest
from httpx import AsyncClient
import io
import uuid
from backend.documents.schemas import ConfidenceLevel

async def get_auth_headers(client: AsyncClient, email: str) -> dict:
    payload = {"email": email, "password": "securepassword123"}
    await client.post("/api/v1/auth/register", json=payload)
    login_resp = await client.post("/api/v1/auth/login", data={"username": email, "password": "securepassword123"})
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

@pytest.mark.asyncio
async def test_upload_confidence_evaluations_and_draft_update(client: AsyncClient):
    headers = await get_auth_headers(client, "upload@example.com")
    
    # Create career session
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]

    # Emulate PDF file upload stream
    file_payload = {"file": ("my_resume.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf content"), "application/pdf")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers
    )
    assert upload_resp.status_code == 201
    upload_data = upload_resp.json()
    assert upload_data["status"] == "pending_review"
    assert upload_data["draft"]["personal_info"]["name"]["value"] == "John Doe"
    
    # Confirm the draft using the new confirmation endpoint
    confirm_payload = {
        "document_type": "cv",
        "content": upload_data["draft"]
    }
    confirm_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/confirm",
        json=confirm_payload,
        headers=headers
    )
    assert confirm_resp.status_code == 200
    assert confirm_resp.json()["content"]["personal_info"]["name"]["value"] == "John Doe"
    assert confirm_resp.json()["content"]["personal_info"]["name"]["confidence"] == ConfidenceLevel.HIGH.value
    
    # Fetch draft and check parsed values and confidence parameters
    draft_resp = await client.get(f"/api/v1/career-sessions/{session_id}/cv-draft", headers=headers)
    assert draft_resp.status_code == 200
    draft_data = draft_resp.json()
    assert draft_data["content"]["personal_info"]["name"]["value"] == "John Doe"
    assert draft_data["content"]["headline"]["value"] == "Software Engineer"
    assert draft_data["content"]["summary"]["value"] is None
    
    # Update draft manually
    update_payload = {
        "content": {
            "personal_info": {"name": {"value": "Jane Doe", "confidence": "HIGH"}}
        }
    }
    update_resp = await client.put(f"/api/v1/career-sessions/{session_id}/cv-draft", json=update_payload, headers=headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["content"]["personal_info"]["name"]["value"] == "Jane Doe"

    # Option A validation: Re-uploading another CV to the same career session (should overwrite)
    file_payload_2 = {"file": ("my_resume_updated.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf update"), "application/pdf")}
    upload_resp_2 = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload_2,
        headers=headers
    )
    assert upload_resp_2.status_code == 201
    upload_data_2 = upload_resp_2.json()
    assert upload_data_2["status"] == "pending_review"
    
    # Confirm the second draft
    confirm_payload_2 = {
        "document_type": "cv",
        "content": upload_data_2["draft"]
    }
    confirm_resp_2 = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/confirm",
        json=confirm_payload_2,
        headers=headers
    )
    assert confirm_resp_2.status_code == 200
    assert confirm_resp_2.json()["content"]["personal_info"]["name"]["value"] == "John Doe"

    # Export document check
    export_resp = await client.post(f"/api/v1/career-sessions/{session_id}/exports/cv?file_type=PDF", headers=headers)
    assert export_resp.status_code == 201
    export_id = export_resp.json()["id"]

    # Download document check (verify file integrity and header types)
    dl_resp = await client.get(f"/api/v1/career-sessions/{session_id}/exports/{export_id}", headers=headers)
    assert dl_resp.status_code == 200
    assert dl_resp.headers["content-type"] == "application/pdf"
    assert b"%PDF-1.4" in dl_resp.content

@pytest.mark.asyncio
async def test_invalid_file_extension_rejection(client: AsyncClient):
    headers = await get_auth_headers(client, "invalid_file@example.com")
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]

    # Emulate TXT file upload (not allowed)
    file_payload = {"file": ("unsupported.txt", io.BytesIO(b"unsupported content"), "text/plain")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers
    )
    assert upload_resp.status_code == 400
    assert "Only .pdf and .docx" in upload_resp.json()["detail"]

@pytest.mark.asyncio
async def test_session_ownership_enforcement_on_uploads(client: AsyncClient):
    headers_owner = await get_auth_headers(client, "owner_upload@example.com")
    headers_attacker = await get_auth_headers(client, "attacker_upload@example.com")
    
    # Owner creates session
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers_owner)
    session_id = session_resp.json()["id"]

    # Attacker attempts to upload file to owner's session
    file_payload = {"file": ("attacker_resume.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf"), "application/pdf")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers_attacker
    )
    assert upload_resp.status_code == 403
    assert "Not authorized" in upload_resp.json()["detail"]

@pytest.mark.asyncio
async def test_extraction_validation_failure(client: AsyncClient, mocker):
    headers = await get_auth_headers(client, "val_fail@example.com")
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]

    # Mock the LLMService response to return invalid JSON schema (invalid email address format)
    mocker.patch(
        "backend.ai.services.llm_service.LLMService.generate_chat_response",
        return_value={
            "content": '{"personal_info": {"name": {"value": "John Doe", "confidence": 0.9}, "email": {"value": "not-an-email", "confidence": 0.9}, "phone": {"value": null, "confidence": 0.0}, "location": {"value": null, "confidence": 0.0}}, "headline": {"value": "Software Engineer", "confidence": 0.9}, "summary": {"value": null, "confidence": 0.0}, "experience": [], "education": [], "skills": [], "projects": [], "certifications": []}',
            "model_used": "mock-gpt-model",
            "prompt_tokens": 100,
            "completion_tokens": 50,
            "finish_reason": "stop",
            "provider_name": "MockProvider"
        }
    )

    file_payload = {"file": ("my_resume.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf"), "application/pdf")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers
    )
    assert upload_resp.status_code == 400
    assert "validation failed" in upload_resp.json()["detail"].lower()

@pytest.mark.asyncio
async def test_extraction_provider_unavailable(client: AsyncClient, mocker):
    headers = await get_auth_headers(client, "service_fail@example.com")
    session_resp = await client.post("/api/v1/career-sessions", json={"goal": "IMPROVE_CV"}, headers=headers)
    session_id = session_resp.json()["id"]

    # Mock the LLMService response to raise ConnectionError (representing missing key/offline state)
    mocker.patch(
        "backend.ai.services.llm_service.LLMService.generate_chat_response",
        side_effect=ConnectionError("LLM provider unavailable")
    )

    file_payload = {"file": ("my_resume.pdf", io.BytesIO(b"%PDF-1.4 dummy pdf"), "application/pdf")}
    upload_resp = await client.post(
        f"/api/v1/career-sessions/{session_id}/documents/upload",
        files=file_payload,
        headers=headers
    )
    assert upload_resp.status_code == 503
    assert "unavailable" in upload_resp.json()["detail"].lower()
