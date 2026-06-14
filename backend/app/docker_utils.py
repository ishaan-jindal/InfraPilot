"""
Docker utilities — Dockerfile generation, image build, container lifecycle.
"""

from __future__ import annotations

import subprocess
from typing import Callable, Optional

# ---------------------------------------------------------------------------
# Dockerfile templates per framework / runtime
# ---------------------------------------------------------------------------

DOCKERFILE_TEMPLATES: dict[str, str] = {
    "nextjs": """\
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["npm", "start"]
""",

    "react": """\
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder --chown=node:node /app/build ./build
USER node
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
""",

    "react-vite": """\
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
""",

    "fastapi": """\
FROM python:3.12-slim
WORKDIR /app
RUN groupadd -g 10001 appuser && useradd -r -u 10001 -g appuser appuser
COPY --chown=appuser:appuser requirements.txt* pyproject.toml* ./
RUN pip install --no-cache-dir -r requirements.txt 2>/dev/null || pip install --no-cache-dir . 2>/dev/null || true
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
""",

    "flask": """\
FROM python:3.12-slim
WORKDIR /app
RUN groupadd -g 10001 appuser && useradd -r -u 10001 -g appuser appuser
COPY --chown=appuser:appuser requirements.txt* pyproject.toml* ./
RUN pip install --no-cache-dir -r requirements.txt 2>/dev/null || pip install --no-cache-dir . 2>/dev/null || true
RUN pip install --no-cache-dir gunicorn
COPY --chown=appuser:appuser . .
USER appuser
EXPOSE 5000
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
""",

    "django": """\
FROM python:3.12-slim
WORKDIR /app
RUN groupadd -g 10001 appuser && useradd -r -u 10001 -g appuser appuser
COPY --chown=appuser:appuser requirements.txt* pyproject.toml* ./
RUN pip install --no-cache-dir -r requirements.txt 2>/dev/null || pip install --no-cache-dir . 2>/dev/null || true
RUN pip install --no-cache-dir gunicorn
COPY --chown=appuser:appuser . .
RUN python manage.py collectstatic --noinput 2>/dev/null || true
USER appuser
EXPOSE 8000
CMD ["gunicorn", "-b", "0.0.0.0:8000", "config.wsgi"]
""",

    "node": """\
FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN npm ci --production
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["npm", "start"]
""",

    "static": """\
FROM node:20-alpine
WORKDIR /app
RUN npm install -g serve
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["serve", "-s", ".", "-l", "3000"]
""",
}


def generate_dockerfile(framework: str, repo_path: str, start_command: str | None = None) -> str:
    """
    Write a Dockerfile into *repo_path* using the template for *framework*.
    If a Dockerfile already exists it is left untouched.
    Returns the Dockerfile content.
    """
    import os

    dockerfile_path = os.path.join(repo_path, "Dockerfile")
    if os.path.exists(dockerfile_path):
        with open(dockerfile_path) as f:
            return f.read()

    template = DOCKERFILE_TEMPLATES.get(framework, DOCKERFILE_TEMPLATES["node"])

    # Patch Django WSGI module if we know the actual path
    if framework == "django" and start_command and "gunicorn" in start_command:
        wsgi_module = start_command.split()[-1]  # e.g. "myproject.wsgi"
        template = template.replace("config.wsgi", wsgi_module)

    with open(dockerfile_path, "w") as f:
        f.write(template)

    return template


def build_image(
    repo_path: str,
    image_tag: str,
    log_callback: Optional[Callable[[str], None]] = None,
) -> bool:
    """
    Build a Docker image from *repo_path*.
    Streams output line-by-line to *log_callback* if provided.
    Returns True on success.
    """
    cmd = ["docker", "build", "-t", image_tag, "."]

    process = subprocess.Popen(
        cmd,
        cwd=repo_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    for line in iter(process.stdout.readline, ""):
        stripped = line.rstrip()
        if log_callback and stripped:
            log_callback(stripped)

    process.wait()
    return process.returncode == 0


def run_container(
    image_tag: str,
    host_port: int,
    container_port: int,
    container_name: str,
    log_callback: Optional[Callable[[str], None]] = None,
) -> str | None:
    """
    Run a Docker container in detached mode with port mapping.
    Returns the container ID on success, None on failure.
    """
    # Remove any existing container with the same name
    subprocess.run(
        ["docker", "rm", "-f", container_name],
        capture_output=True,
        text=True,
    )

    cmd = [
        "docker", "run", "-d",
        "--name", container_name,
        "-p", f"{host_port}:{container_port}",
        "--restart", "unless-stopped",
        image_tag,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        if log_callback:
            log_callback(f"ERROR: Failed to start container: {result.stderr}")
        return None

    container_id = result.stdout.strip()[:12]
    if log_callback:
        log_callback(f"Container started: {container_id}")
    return container_id


def stop_container(container_name: str) -> bool:
    """Stop and remove a container by name."""
    result = subprocess.run(
        ["docker", "rm", "-f", container_name],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0


def get_container_status(container_name: str) -> dict:
    """Get the current status of a container."""
    result = subprocess.run(
        ["docker", "inspect", "--format", "{{.State.Status}}", container_name],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        return {"status": "not_found", "container": container_name}

    return {
        "status": result.stdout.strip(),
        "container": container_name,
    }


def remove_image(image_tag: str) -> bool:
    """Remove a Docker image."""
    result = subprocess.run(
        ["docker", "rmi", "-f", image_tag],
        capture_output=True,
        text=True,
    )
    return result.returncode == 0
