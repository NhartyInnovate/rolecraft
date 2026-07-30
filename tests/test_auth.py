import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_user(client: AsyncClient):
    payload = {
        "email": "test@example.com",
        "password": "strongpassword123"
    }
    response = await client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
    assert data["is_active"] is True

@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {
        "email": "test@example.com",
        "password": "strongpassword123"
    }
    # First registration
    response1 = await client.post("/api/v1/auth/register", json=payload)
    assert response1.status_code == 201
    
    # Second registration with same email
    response2 = await client.post("/api/v1/auth/register", json=payload)
    assert response2.status_code == 400
    assert "already exists" in response2.json()["detail"]

@pytest.mark.asyncio
async def test_login_user(client: AsyncClient):
    # Register first
    payload = {
        "email": "login@example.com",
        "password": "strongpassword123"
    }
    await client.post("/api/v1/auth/register", json=payload)
    
    # Login
    login_payload = {
        "username": "login@example.com",
        "password": "strongpassword123"
    }
    response = await client.post("/api/v1/auth/login", data=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_incorrect_password(client: AsyncClient):
    payload = {
        "email": "wrongpass@example.com",
        "password": "strongpassword123"
    }
    await client.post("/api/v1/auth/register", json=payload)
    
    login_payload = {
        "username": "wrongpass@example.com",
        "password": "wrongpassword"
    }
    response = await client.post("/api/v1/auth/login", data=login_payload)
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]

@pytest.mark.asyncio
async def test_refresh_token(client: AsyncClient):
    payload = {
        "email": "refresh@example.com",
        "password": "strongpassword123"
    }
    await client.post("/api/v1/auth/register", json=payload)
    
    login_payload = {
        "username": "refresh@example.com",
        "password": "strongpassword123"
    }
    login_response = await client.post("/api/v1/auth/login", data=login_payload)
    assert login_response.status_code == 200
    tokens = login_response.json()
    refresh_token = tokens["refresh_token"]
    
    # Use refresh token to get new access token
    refresh_response = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_response.status_code == 200
    data = refresh_response.json()
    assert "access_token" in data
    assert "refresh_token" in data
