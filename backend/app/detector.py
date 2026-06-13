"""
Automatic framework detection via static analysis of repository files.

Inspects package.json, requirements.txt, pyproject.toml, manage.py, Dockerfile,
and index.html to determine the framework and generate build/start configuration.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass
from typing import Optional


@dataclass
class FrameworkInfo:
    framework: str
    build_command: Optional[str]
    start_command: str
    port: int
    runtime: str  # e.g. "node", "python", "docker", "static"

    def to_dict(self) -> dict:
        return {
            "framework": self.framework,
            "build_command": self.build_command,
            "start_command": self.start_command,
            "port": self.port,
            "runtime": self.runtime,
        }


def detect_framework(repo_path: str) -> FrameworkInfo:
    """
    Analyze a cloned repository and return the detected framework config.
    Detection priority:
      1. Dockerfile present → docker (user-provided)
      2. package.json with next → nextjs
      3. package.json with react (no next) → react (Vite/CRA)
      4. requirements.txt / pyproject.toml with fastapi → fastapi
      5. requirements.txt / pyproject.toml with flask → flask
      6. manage.py or django in deps → django
      7. package.json (generic node) → node
      8. index.html at root → static
      9. Fallback → unknown
    """

    has_dockerfile = os.path.exists(os.path.join(repo_path, "Dockerfile"))
    package_json = _read_package_json(repo_path)
    requirements = _read_requirements(repo_path)
    has_manage_py = os.path.exists(os.path.join(repo_path, "manage.py"))
    has_index_html = os.path.exists(os.path.join(repo_path, "index.html"))
    pyproject_deps = _read_pyproject_deps(repo_path)

    all_py_deps = (requirements + " " + pyproject_deps).lower()

    # 1. User-provided Dockerfile takes highest priority
    if has_dockerfile:
        return FrameworkInfo(
            framework="docker",
            build_command=None,  # Dockerfile handles build
            start_command="docker",
            port=3000,
            runtime="docker",
        )

    # 2. Next.js
    if package_json:
        deps = _get_all_deps(package_json)
        if "next" in deps:
            return FrameworkInfo(
                framework="nextjs",
                build_command="npm run build",
                start_command="npm start",
                port=3000,
                runtime="node",
            )

        # 3. React (Vite or CRA)
        if "react" in deps:
            # Check if Vite-based
            if "vite" in deps:
                return FrameworkInfo(
                    framework="react-vite",
                    build_command="npm run build",
                    start_command="npx serve -s dist -l 3000",
                    port=3000,
                    runtime="node",
                )
            return FrameworkInfo(
                framework="react",
                build_command="npm run build",
                start_command="npx serve -s build -l 3000",
                port=3000,
                runtime="node",
            )

    # 4. FastAPI
    if "fastapi" in all_py_deps:
        main_module = _find_python_entrypoint(repo_path, "fastapi")
        return FrameworkInfo(
            framework="fastapi",
            build_command=None,
            start_command=f"uvicorn {main_module}:app --host 0.0.0.0 --port 8000",
            port=8000,
            runtime="python",
        )

    # 5. Flask
    if "flask" in all_py_deps:
        main_module = _find_python_entrypoint(repo_path, "flask")
        return FrameworkInfo(
            framework="flask",
            build_command=None,
            start_command=f"gunicorn -b 0.0.0.0:5000 {main_module}:app",
            port=5000,
            runtime="python",
        )

    # 6. Django
    if has_manage_py or "django" in all_py_deps:
        wsgi_module = _find_django_wsgi(repo_path)
        return FrameworkInfo(
            framework="django",
            build_command="python manage.py collectstatic --noinput",
            start_command=f"gunicorn -b 0.0.0.0:8000 {wsgi_module}",
            port=8000,
            runtime="python",
        )

    # 7. Generic Node
    if package_json:
        start = package_json.get("scripts", {}).get("start", "node index.js")
        return FrameworkInfo(
            framework="node",
            build_command=package_json.get("scripts", {}).get("build"),
            start_command=start,
            port=3000,
            runtime="node",
        )

    # 8. Static site
    if has_index_html:
        return FrameworkInfo(
            framework="static",
            build_command=None,
            start_command="npx serve -s . -l 3000",
            port=3000,
            runtime="static",
        )

    # 9. Unknown
    return FrameworkInfo(
        framework="unknown",
        build_command=None,
        start_command="echo 'No start command detected'",
        port=3000,
        runtime="unknown",
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _read_package_json(repo_path: str) -> Optional[dict]:
    pkg_path = os.path.join(repo_path, "package.json")
    if not os.path.exists(pkg_path):
        return None
    try:
        with open(pkg_path) as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return None


def _get_all_deps(package_json: dict) -> set[str]:
    deps: set[str] = set()
    for key in ("dependencies", "devDependencies"):
        deps.update(package_json.get(key, {}).keys())
    return deps


def _read_requirements(repo_path: str) -> str:
    req_path = os.path.join(repo_path, "requirements.txt")
    if not os.path.exists(req_path):
        return ""
    try:
        with open(req_path) as f:
            return f.read()
    except OSError:
        return ""


def _read_pyproject_deps(repo_path: str) -> str:
    pyproj_path = os.path.join(repo_path, "pyproject.toml")
    if not os.path.exists(pyproj_path):
        return ""
    try:
        with open(pyproj_path) as f:
            return f.read()
    except OSError:
        return ""


def _find_python_entrypoint(repo_path: str, framework: str) -> str:
    """Try to locate the main Python module that creates the app object."""
    # Common patterns
    candidates = ["main", "app.main", "app", "server", "api.main", "src.main"]

    for candidate in candidates:
        parts = candidate.split(".")
        file_path = os.path.join(repo_path, *parts) + ".py"
        if os.path.exists(file_path):
            try:
                with open(file_path) as f:
                    content = f.read()
                if framework.lower() in content.lower() or "app" in content:
                    return candidate
            except OSError:
                continue

    # Check for app/ package with __init__.py
    init_path = os.path.join(repo_path, "app", "__init__.py")
    if os.path.exists(init_path):
        return "app"

    # Fallback
    if os.path.exists(os.path.join(repo_path, "main.py")):
        return "main"

    return "main"


def _find_django_wsgi(repo_path: str) -> str:
    """Find the Django WSGI module by looking for wsgi.py."""
    for root, _dirs, files in os.walk(repo_path):
        if "wsgi.py" in files:
            rel = os.path.relpath(root, repo_path)
            module = rel.replace(os.sep, ".")
            return f"{module}.wsgi"
    return "config.wsgi"
