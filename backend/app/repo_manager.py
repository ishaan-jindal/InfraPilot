"""
Repository management — cloning and commit hash extraction.
"""

from __future__ import annotations

import os
import shutil
import subprocess


def clone_repo(repo_url: str, target_dir: str, token: str | None = None, branch: str = "main") -> str:
    """
    Clone a GitHub repository into *target_dir*.

    If a *token* is provided the URL is rewritten to include it for private
    repo access:  https://<token>@github.com/owner/repo.git

    Returns the absolute path to the cloned directory.
    """
    # Clean up any previous clone at this path
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)

    os.makedirs(os.path.dirname(target_dir), exist_ok=True)

    # Inject token for private repos
    auth_url = repo_url
    if token:
        auth_url = repo_url.replace("https://", f"https://{token}@")

    # Ensure .git suffix
    if not auth_url.endswith(".git"):
        auth_url += ".git"

    cmd = ["git", "clone", "--depth", "1", "--branch", branch, auth_url, target_dir]

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)

    if result.returncode != 0:
        # Try without branch (default branch)
        cmd_fallback = ["git", "clone", "--depth", "1", auth_url, target_dir]
        result = subprocess.run(cmd_fallback, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            raise RuntimeError(f"git clone failed: {result.stderr}")

    return os.path.abspath(target_dir)


def get_latest_commit(repo_path: str) -> str:
    """Return the HEAD commit hash for a cloned repo."""
    result = subprocess.run(
        ["git", "rev-parse", "HEAD"],
        capture_output=True,
        text=True,
        cwd=repo_path,
    )
    if result.returncode != 0:
        return "unknown"
    return result.stdout.strip()
