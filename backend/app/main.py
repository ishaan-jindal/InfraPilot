"""
InfraPilot — FastAPI application entry point.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_tables
from app.github import router as auth_router, repo_router
from app.deploy import router as deploy_router
from app.ws import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # Startup: create database tables
    create_tables()
    yield
    # Shutdown: nothing to clean up for now


app = FastAPI(
    title="InfraPilot",
    description="Deploy Anywhere — managed hosting + BYOI in one platform.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS — allow all origins for the MVP
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(repo_router)
app.include_router(deploy_router)
app.include_router(ws_router)


@app.get("/", tags=["health"])
def root():
    return {
        "project": "InfraPilot",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
def health():
    return {"status": "healthy"}
