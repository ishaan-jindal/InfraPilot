import time
import httpx
from typing import Dict, Optional
from fastapi import Header, HTTPException, Query, status, Request

# Simple in-memory user cache to avoid hitting GitHub API on every single request
# token -> {"username": username, "expires_at": timestamp}
_USER_CACHE: Dict[str, Dict] = {}
_CACHE_TTL = 3600  # 1 hour cache duration

def get_cached_user(token: str) -> Optional[str]:
    now = time.time()
    if token in _USER_CACHE:
        entry = _USER_CACHE[token]
        if entry["expires_at"] > now:
            return entry["username"]
        else:
            del _USER_CACHE[token]
    return None

def cache_user(token: str, username: str):
    _USER_CACHE[token] = {
        "username": username,
        "expires_at": time.time() + _CACHE_TTL
    }

async def get_github_username(token: str) -> str:
    # Check cache first
    cached = get_cached_user(token)
    if cached:
        return cached

    # Fetch from GitHub
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github+json",
                },
                timeout=5
            )
            if resp.status_code == 200:
                data = resp.json()
                username = data.get("login")
                if username:
                    cache_user(token, username)
                    return username
        except Exception:
            pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired GitHub token"
    )

async def get_current_user(
    request: Request,
    authorization: Optional[str] = Header(None),
    token: Optional[str] = Query(None)
) -> str:
    # 1. Try to get token from Authorization header
    auth_token = None
    if authorization and authorization.startswith("Bearer "):
        auth_token = authorization.split(" ", 1)[1]
    
    # 2. Try to get token from query parameters (fallback for WebSockets/certain requests)
    if not auth_token:
        auth_token = token

    if not auth_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing GitHub authentication token"
        )

    return await get_github_username(auth_token)
