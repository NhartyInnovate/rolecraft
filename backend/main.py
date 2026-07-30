from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.auth.router import router as auth_router
from backend.profiles.router import router as profiles_router
from backend.career_sessions.router import router as sessions_router
from backend.conversations.router import router as conversations_router
from backend.documents.router import router as documents_router

app = FastAPI(
    title="RoleCraft Backend API",
    description="Conversational AI CV Builder and Career Companion Backend",
    version="0.1.0",
)

# CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict configuration as deployment scopes define targets
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz", tags=["System"])
async def healthz():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

app.include_router(auth_router, prefix="/api/v1")
app.include_router(profiles_router, prefix="/api/v1")
app.include_router(sessions_router, prefix="/api/v1")
app.include_router(conversations_router, prefix="/api/v1")
app.include_router(documents_router, prefix="/api/v1")
