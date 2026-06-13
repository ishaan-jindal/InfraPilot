"""
GitHub OAuth and repository API routes.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
import requests as http_requests

from app.config import GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/github")
def github_login():
    """Redirect to GitHub OAuth with repo scope for private repo access."""
    github_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&scope=repo"
    )
    return RedirectResponse(github_url)


@router.get("/callback")
def github_callback(code: str):
    """Exchange the OAuth code for an access token."""
    token_response = http_requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": GITHUB_CLIENT_ID,
            "client_secret": GITHUB_CLIENT_SECRET,
            "code": code,
        },
        timeout=15,
    )

    data = token_response.json()
    if "access_token" not in data:
        raise HTTPException(
            status_code=400,
            detail=data.get("error_description", "Failed to obtain access token"),
        )

    return {"access_token": data["access_token"]}


# ---------------------------------------------------------------------------
# Repository API (separate prefix)
# ---------------------------------------------------------------------------

repo_router = APIRouter(prefix="/repositories", tags=["repositories"])


def _github_headers(token: str) -> dict:
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
    }


@repo_router.get("")
def list_repositories(
    token: str = Query(..., description="GitHub access token"),
    page: int = Query(1, ge=1),
    per_page: int = Query(30, ge=1, le=100),
):
    """List the authenticated user's repositories."""
    resp = http_requests.get(
        "https://api.github.com/user/repos",
        headers=_github_headers(token),
        params={
            "sort": "updated",
            "direction": "desc",
            "page": page,
            "per_page": per_page,
            "type": "all",
        },
        timeout=15,
    )

    if resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid or expired GitHub token")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="GitHub API error")

    repos = resp.json()

    # Return a simplified view
    return [
        {
            "id": r["id"],
            "name": r["name"],
            "full_name": r["full_name"],
            "html_url": r["html_url"],
            "clone_url": r["clone_url"],
            "description": r.get("description"),
            "language": r.get("language"),
            "private": r["private"],
            "default_branch": r["default_branch"],
            "updated_at": r["updated_at"],
        }
        for r in repos
    ]


@repo_router.get("/{owner}/{repo}")
def get_repository(owner: str, repo: str, token: str = Query(...)):
    """Get details for a single repository."""
    resp = http_requests.get(
        f"https://api.github.com/repos/{owner}/{repo}",
        headers=_github_headers(token),
        timeout=15,
    )

    if resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid or expired GitHub token")
    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Repository not found")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="GitHub API error")

    r = resp.json()
    return {
        "id": r["id"],
        "name": r["name"],
        "full_name": r["full_name"],
        "html_url": r["html_url"],
        "clone_url": r["clone_url"],
        "description": r.get("description"),
        "language": r.get("language"),
        "private": r["private"],
        "default_branch": r["default_branch"],
        "updated_at": r["updated_at"],
    }


@repo_router.get("/{owner}/{repo}/branches")
def list_branches(owner: str, repo: str, token: str = Query(...)):
    """List branches for a repository."""
    resp = http_requests.get(
        f"https://api.github.com/repos/{owner}/{repo}/branches",
        headers=_github_headers(token),
        params={"per_page": 100},
        timeout=15,
    )

    if resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Invalid or expired GitHub token")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail="GitHub API error")

    return [
        {"name": b["name"], "commit_sha": b["commit"]["sha"]}
        for b in resp.json()
    ]
