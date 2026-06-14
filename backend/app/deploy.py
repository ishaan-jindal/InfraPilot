"""
Deployment pipeline — the core of InfraPilot.

Endpoints:
  POST   /deploy                     — start a new deployment
  GET    /deployments                 — list all deployments
  GET    /deploy/{id}                 — get deployment details
  GET    /deploy/{id}/logs            — get deployment logs
  POST   /deploy/{id}/redeploy       — redeploy from same repo
  DELETE /deploy/{id}                 — stop and remove deployment

The actual work runs as a FastAPI BackgroundTask so the POST returns
immediately with a deployment ID.
"""

from __future__ import annotations

import os
import re
import json
import asyncio
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.config import REPOS_BASE_DIR, PORT_RANGE_START, PORT_RANGE_END
from app.database import get_db
from app.models import Deployment, DeploymentStatus, DeploymentTarget
from app.repo_manager import clone_repo, get_latest_commit
from app.detector import detect_framework
from app.docker_utils import generate_dockerfile, build_image, run_container, stop_container, get_container_status
from app.caddy import add_reverse_proxy, remove_reverse_proxy, get_deployment_url
from app.ws import get_broadcaster, log_sync, remove_broadcaster
from app.auth import get_current_user

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class DeployRequest(BaseModel):
    repo_url: str
    token: Optional[str] = None
    project_name: str
    branch: str = "main"


class DeployResponse(BaseModel):
    deployment_id: str
    project_name: str
    status: str
    message: str

    class Config:
        from_attributes = True


class DeploymentOut(BaseModel):
    id: str
    project_name: str
    repo_url: str
    branch: str | None
    commit_hash: str | None
    framework: str | None
    build_command: str | None
    start_command: str | None
    port: int | None
    status: str
    target: str
    host_port: int | None
    subdomain: str | None
    url: str | None
    security_score: int | None
    security_report: list | None
    security_advice: str | None
    created_at: str | None
    updated_at: str | None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _sanitize_project_name(name: str) -> str:
    """Create a DNS-safe, Docker-safe name."""
    sanitized = re.sub(r"[^a-z0-9\-]", "-", name.lower())
    sanitized = re.sub(r"-+", "-", sanitized).strip("-")
    return sanitized or "project"


def _find_available_port(db: Session) -> int:
    """Find the next available host port for a managed deployment."""
    used_ports = {
        row.host_port
        for row in db.query(Deployment.host_port)
        .filter(
            Deployment.host_port.isnot(None),
            Deployment.status.notin_([DeploymentStatus.STOPPED, DeploymentStatus.FAILED]),
        )
        .all()
    }

    for port in range(PORT_RANGE_START, PORT_RANGE_END):
        if port not in used_ports:
            return port

    raise RuntimeError("No available ports in the configured range")


def _get_owned_deployment(db: Session, deployment_id: UUID, current_user: str) -> Deployment:
    """Helper to fetch a deployment and verify ownership."""
    dep = db.query(Deployment).filter(Deployment.id == deployment_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Deployment not found")
    if dep.github_user != current_user:
        raise HTTPException(status_code=403, detail="Access denied: You do not own this deployment")
    return dep


def _to_out(dep: Deployment) -> dict:
    """Serialize a Deployment to a response dict."""
    # security_report is stored as a JSON string in the DB (Text column)
    report = []
    if dep.security_report:
        try:
            report = json.loads(dep.security_report)
        except Exception:
            report = []

    return {
        "id": str(dep.id),
        "project_name": dep.project_name,
        "repo_url": dep.repo_url,
        "branch": dep.branch,
        "commit_hash": dep.commit_hash,
        "framework": dep.framework,
        "build_command": dep.build_command,
        "start_command": dep.start_command,
        "port": dep.port,
        "status": dep.status.value if dep.status else None,
        "target": dep.target.value if dep.target else None,
        "host_port": dep.host_port,
        "subdomain": dep.subdomain,
        "url": dep.url,
        "security_score": dep.security_score,
        "security_report": report,
        "security_advice": dep.security_advice or "",
        "created_at": dep.created_at.isoformat() if dep.created_at else None,
        "updated_at": dep.updated_at.isoformat() if dep.updated_at else None,
    }


# ---------------------------------------------------------------------------
# Background deployment pipeline
# ---------------------------------------------------------------------------

def _update_status(db: Session, dep: Deployment, status: DeploymentStatus, log_line: str | None = None):
    """Update deployment status and optionally append a log line."""
    dep.status = status
    if log_line:
        dep.logs = (dep.logs or "") + log_line + "\n"
    db.commit()


def run_deployment_pipeline(deployment_id: str, db_url: str):
    """
    The main deployment pipeline, runs in a background thread.

    Steps:
      1. Clone repo
      2. Detect framework
      3. Generate Dockerfile
      4. Build Docker image
      5. Run container
      6. Configure reverse proxy
    """
    from app.database import SessionLocal
    from uuid import UUID as PyUUID

    if isinstance(deployment_id, str):
        deployment_id = PyUUID(deployment_id)

    db = SessionLocal()
    dep = db.query(Deployment).filter(Deployment.id == deployment_id).first()

    if not dep:
        return

    dep_id_str = str(dep.id)

    def log(msg: str):
        log_sync(dep_id_str, msg)
        dep.logs = (dep.logs or "") + msg + "\n"
        db.commit()

    try:
        # --- Step 1: Clone ---
        _update_status(db, dep, DeploymentStatus.CLONING)
        log(f"📦 Cloning repository: {dep.repo_url} (branch: {dep.branch})")

        repo_dir = os.path.join(REPOS_BASE_DIR, dep.project_name)
        clone_repo(dep.repo_url, repo_dir, token=None, branch=dep.branch or "main")

        commit = get_latest_commit(repo_dir)
        dep.commit_hash = commit
        
        # Keep subdomain as: project-name-5letteruniquegitid
        unique_id = commit[:5] if commit else "xxxxx"
        subdomain = f"{dep.project_name}-{unique_id}"
        
        # Prevent subdomain collisions
        exists = db.query(Deployment).filter(Deployment.subdomain == subdomain, Deployment.id != dep.id).first()
        if exists:
            import uuid
            subdomain = f"{dep.project_name}-{unique_id}-{uuid.uuid4().hex[:3]}"
            
        dep.subdomain = subdomain
        db.commit()
        
        log(f"✅ Repository cloned. Commit: {commit[:8]}")

        # --- Step 2: Detect framework ---
        _update_status(db, dep, DeploymentStatus.DETECTING)
        log("🔍 Detecting framework...")

        fw = detect_framework(repo_dir)
        dep.framework = fw.framework
        dep.build_command = fw.build_command
        dep.start_command = fw.start_command
        dep.port = fw.port
        dep.runtime = fw.runtime
        db.commit()

        log(f"✅ Framework detected: {fw.framework}")
        log(f"   Build: {fw.build_command or 'N/A'}")
        log(f"   Start: {fw.start_command}")
        log(f"   Port:  {fw.port}")

        # --- Step 3: Generate Dockerfile ---
        log("📄 Generating Dockerfile...")
        dockerfile = generate_dockerfile(fw.framework, repo_dir, fw.start_command)
        log("✅ Dockerfile ready")

        # --- Step 3.5: Run Security Scan ---
        _update_status(db, dep, DeploymentStatus.SCANNING)
        log("🛡️ Running Security Scan...")

        from app.security import run_security_scan, generate_remediation_advice, calculate_security_score, get_score_label
        from app.config import GEMINI_API_KEY

        findings = run_security_scan(repo_dir, dockerfile, fw.port)
        score = calculate_security_score(findings)
        label = get_score_label(score)

        dep.security_report = json.dumps(findings)
        dep.security_score = score
        db.commit()

        log(f"📊 Security Score: {score}/100 — {label}")

        if findings:
            high_or_critical = any(f["severity"] in ("CRITICAL", "HIGH") for f in findings)
            if high_or_critical:
                log(f"⚠️ Security scan completed with {len(findings)} findings. Potentially unsafe configuration detected!")
                log("🤖 Generating AI security advice...")
                advice = generate_remediation_advice(findings, api_key=GEMINI_API_KEY)
                dep.security_advice = advice
                db.commit()
                _update_status(db, dep, DeploymentStatus.AWAITING_APPROVAL)
                log("🛑 Deployment paused. Please review the security advice and approve to proceed.")
                return
            else:
                log(f"ℹ️ Security scan completed with {len(findings)} low/medium findings. Proceeding automatically.")
                dep.security_advice = generate_remediation_advice(findings, api_key=GEMINI_API_KEY)
                db.commit()
        else:
            log("✅ Security scan completed: No issues found.")
            dep.security_advice = None
            db.commit()

        # --- Step 4: Build Docker image ---
        _update_status(db, dep, DeploymentStatus.BUILDING)
        image_tag = f"infrapilot-{dep.project_name}:latest"
        log(f"🔨 Building Docker image: {image_tag}")

        success = build_image(repo_dir, image_tag, log_callback=log)

        if not success:
            _update_status(db, dep, DeploymentStatus.FAILED)
            log("❌ Docker build failed")
            return

        log("✅ Docker image built successfully")

        # --- Step 5: Run container ---
        _update_status(db, dep, DeploymentStatus.STARTING)
        container_name = f"infrapilot-{dep.project_name}"
        log(f"🚀 Starting container: {container_name}")
        log(f"   Mapping port {dep.host_port} → {fw.port}")

        container_id = run_container(
            image_tag=image_tag,
            host_port=dep.host_port,
            container_port=fw.port,
            container_name=container_name,
            log_callback=log,
        )

        if not container_id:
            _update_status(db, dep, DeploymentStatus.FAILED)
            log("❌ Failed to start container")
            return

        dep.container_id = container_id
        dep.container_name = container_name
        db.commit()
        log(f"✅ Container running: {container_id}")

        # --- Step 6: Configure reverse proxy ---
        _update_status(db, dep, DeploymentStatus.CONFIGURING_PROXY)
        log(f"🌐 Configuring reverse proxy for {dep.subdomain}...")

        # Run the async caddy call from the sync thread
        loop = asyncio.new_event_loop()
        proxy_ok = loop.run_until_complete(add_reverse_proxy(dep.subdomain, dep.host_port))
        loop.close()

        if proxy_ok:
            log("✅ Reverse proxy configured")
        else:
            log("⚠️  Caddy not available — skipping reverse proxy (app still accessible via port)")

        # --- Done ---
        url = get_deployment_url(dep.subdomain)
        dep.url = url
        _update_status(db, dep, DeploymentStatus.RUNNING)
        log(f"🎉 Deployment successful!")
        log(f"   URL: {url}")
        log(f"   Direct: http://localhost:{dep.host_port}")

    except Exception as e:
        _update_status(db, dep, DeploymentStatus.FAILED)
        log(f"❌ Deployment failed: {str(e)}")
    finally:
        db.close()


def resume_deployment_pipeline(deployment_id: str, db_url: str):
    """
    Resumes a gated deployment after manual approval.
    Runs from Step 4 (Build Docker image) to the end.
    """
    from app.database import SessionLocal
    from uuid import UUID as PyUUID

    if isinstance(deployment_id, str):
        deployment_id = PyUUID(deployment_id)

    db = SessionLocal()
    dep = db.query(Deployment).filter(Deployment.id == deployment_id).first()

    if not dep:
        return

    dep_id_str = str(dep.id)

    def log(msg: str):
        log_sync(dep_id_str, msg)
        dep.logs = (dep.logs or "") + msg + "\n"
        db.commit()

    try:
        # Verify framework details are present
        if not dep.framework:
            raise RuntimeError("Missing framework details; cannot resume")

        repo_dir = os.path.join(REPOS_BASE_DIR, dep.project_name)

        # --- Step 4: Build Docker image ---
        _update_status(db, dep, DeploymentStatus.BUILDING)
        image_tag = f"infrapilot-{dep.project_name}:latest"
        log(f"🔨 Resuming: Building Docker image: {image_tag}")

        success = build_image(repo_dir, image_tag, log_callback=log)

        if not success:
            _update_status(db, dep, DeploymentStatus.FAILED)
            log("❌ Docker build failed")
            return

        log("✅ Docker image built successfully")

        # --- Step 5: Run container ---
        _update_status(db, dep, DeploymentStatus.STARTING)
        container_name = f"infrapilot-{dep.project_name}"
        log(f"🚀 Starting container: {container_name}")
        log(f"   Mapping port {dep.host_port} → {dep.port}")

        container_id = run_container(
            image_tag=image_tag,
            host_port=dep.host_port,
            container_port=dep.port,
            container_name=container_name,
            log_callback=log,
        )

        if not container_id:
            _update_status(db, dep, DeploymentStatus.FAILED)
            log("❌ Failed to start container")
            return

        dep.container_id = container_id
        dep.container_name = container_name
        db.commit()
        log(f"✅ Container running: {container_id}")

        # --- Step 6: Configure reverse proxy ---
        _update_status(db, dep, DeploymentStatus.CONFIGURING_PROXY)
        log(f"🌐 Configuring reverse proxy for {dep.subdomain}...")

        # Run the async caddy call from the sync thread
        loop = asyncio.new_event_loop()
        proxy_ok = loop.run_until_complete(add_reverse_proxy(dep.subdomain, dep.host_port))
        loop.close()

        if proxy_ok:
            log("✅ Reverse proxy configured")
        else:
            log("⚠️  Caddy not available — skipping reverse proxy (app still accessible via port)")

        # --- Done ---
        url = get_deployment_url(dep.subdomain)
        dep.url = url
        _update_status(db, dep, DeploymentStatus.RUNNING)
        log(f"🎉 Deployment successful!")
        log(f"   URL: {url}")
        log(f"   Direct: http://localhost:{dep.host_port}")

    except Exception as e:
        _update_status(db, dep, DeploymentStatus.FAILED)
        log(f"❌ Deployment failed: {str(e)}")
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/deploy", response_model=DeployResponse)
def deploy(
    req: DeployRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Kick off a new managed deployment."""
    project_name = _sanitize_project_name(req.project_name)

    # Allocate a host port
    host_port = _find_available_port(db)
    import uuid
    subdomain = f"{project_name}-temp-{uuid.uuid4().hex[:5]}"

    # Create deployment record
    dep = Deployment(
        project_name=project_name,
        repo_url=req.repo_url,
        branch=req.branch,
        status=DeploymentStatus.PENDING,
        target=DeploymentTarget.MANAGED,
        host_port=host_port,
        subdomain=subdomain,
        github_user=current_user,
    )
    db.add(dep)
    db.commit()
    db.refresh(dep)

    # Launch pipeline in background
    background_tasks.add_task(run_deployment_pipeline, str(dep.id), str(dep.id))

    return DeployResponse(
        deployment_id=str(dep.id),
        project_name=project_name,
        status="pending",
        message=f"Deployment queued. Track logs at /ws/logs/{dep.id}",
    )


@router.get("/deployments")
def list_deployments(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """List all deployments belonging to the current user, most recent first."""
    deps = (
        db.query(Deployment)
        .filter(Deployment.github_user == current_user)
        .order_by(desc(Deployment.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )
    total = db.query(Deployment).filter(Deployment.github_user == current_user).count()

    return {
        "total": total,
        "deployments": [_to_out(d) for d in deps],
    }


@router.get("/deploy/{deployment_id}")
def get_deployment(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get full deployment details."""
    dep = _get_owned_deployment(db, deployment_id, current_user)
    return _to_out(dep)


@router.get("/deploy/{deployment_id}/logs")
def get_deployment_logs(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get deployment logs."""
    dep = _get_owned_deployment(db, deployment_id, current_user)

    # Merge DB logs with any in-memory buffer
    broadcaster = get_broadcaster(str(dep.id))
    live_log = broadcaster.get_full_log()

    return {
        "deployment_id": str(dep.id),
        "status": dep.status.value,
        "logs": live_log or dep.logs or "",
    }


@router.post("/deploy/{deployment_id}/redeploy", response_model=DeployResponse)
def redeploy(
    deployment_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Redeploy an existing deployment (re-clone, re-build, re-run)."""
    dep = _get_owned_deployment(db, deployment_id, current_user)

    # Stop existing container if running
    if dep.container_name:
        stop_container(dep.container_name)

    # Reset state — including stale security data from previous run
    dep.status = DeploymentStatus.PENDING
    dep.logs = ""
    dep.container_id = None
    dep.security_report = None
    dep.security_advice = None
    dep.security_score = None
    db.commit()

    # Clear log broadcaster
    remove_broadcaster(str(dep.id))

    background_tasks.add_task(run_deployment_pipeline, str(dep.id), str(dep.id))

    return DeployResponse(
        deployment_id=str(dep.id),
        project_name=dep.project_name,
        status="pending",
        message="Redeployment queued",
    )


@router.delete("/deploy/{deployment_id}")
def delete_deployment(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Stop container, remove reverse proxy, delete Docker image, delete cloned repo, and delete Postgres entry."""
    import shutil
    from app.docker_utils import remove_image

    dep = _get_owned_deployment(db, deployment_id, current_user)

    # 1. Stop container
    if dep.container_name:
        stop_container(dep.container_name)

    # 2. Remove reverse proxy
    if dep.subdomain:
        loop = asyncio.new_event_loop()
        loop.run_until_complete(remove_reverse_proxy(dep.subdomain))
        loop.close()

    # 3. Remove Docker image
    image_tag = f"infrapilot-{dep.project_name}:latest"
    remove_image(image_tag)

    # 4. Delete local cloned repository directory
    repo_dir = os.path.join(REPOS_BASE_DIR, dep.project_name)
    if os.path.exists(repo_dir):
        shutil.rmtree(repo_dir, ignore_errors=True)

    # 5. Cleanup broadcaster
    remove_broadcaster(str(dep.id))

    # 6. Delete from Postgres
    db.delete(dep)
    db.commit()

    return {"detail": "Deployment deleted successfully", "deployment_id": str(deployment_id)}


@router.get("/deploy/{deployment_id}/status")
def get_container_health(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Check the live container status for a deployment."""
    dep = _get_owned_deployment(db, deployment_id, current_user)

    if not dep.container_name:
        return {"deployment_id": str(dep.id), "container_status": "no_container"}

    status = get_container_status(dep.container_name)
    return {
        "deployment_id": str(dep.id),
        "deployment_status": dep.status.value,
        "container_status": status["status"],
    }


@router.get("/deploy/{deployment_id}/security-advisor")
def get_security_advisor(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Get security scan report and AI remediation advice."""
    import json
    dep = _get_owned_deployment(db, deployment_id, current_user)
        
    report = []
    if dep.security_report:
        try:
            report = json.loads(dep.security_report)
        except Exception:
            pass
            
    return {
        "deployment_id": str(dep.id),
        "status": dep.status.value,
        "report": report,
        "advice": dep.security_advice or ""
    }


@router.post("/deploy/{deployment_id}/approve")
def approve_deployment(
    deployment_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """Manually approve and resume a gated deployment."""
    dep = _get_owned_deployment(db, deployment_id, current_user)
        
    if dep.status != DeploymentStatus.AWAITING_APPROVAL:
        raise HTTPException(
            status_code=400,
            detail=f"Deployment cannot be approved in its current state: {dep.status.value}"
        )
        
    # Reset status and resume execution in background
    dep.status = DeploymentStatus.PENDING
    db.commit()
    
    # Broadcast / Log resume action
    log_sync(str(dep.id), "🚀 Deployment approved. Resuming pipeline...")
    
    background_tasks.add_task(resume_deployment_pipeline, str(dep.id), str(dep.id))
    
    return {
        "deployment_id": str(dep.id),
        "status": "pending",
        "message": "Deployment approved. Resuming build & deploy..."
    }


@router.get("/deploy/{deployment_id}/security-report")
def get_security_report(
    deployment_id: UUID,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    """
    Get a structured security scan report with severity summary and security score.
    Used by the frontend to render the security dashboard card.
    """
    from app.security import get_score_label
    dep = _get_owned_deployment(db, deployment_id, current_user)

    report = []
    if dep.security_report:
        try:
            report = json.loads(dep.security_report)
        except Exception:
            report = []

    critical = [v for v in report if v.get("severity") == "CRITICAL"]
    high     = [v for v in report if v.get("severity") == "HIGH"]
    medium   = [v for v in report if v.get("severity") == "MEDIUM"]
    low      = [v for v in report if v.get("severity") == "LOW"]

    score = dep.security_score
    label = get_score_label(score) if score is not None else "Not scanned"

    return {
        "deployment_id": str(dep.id),
        "project_name": dep.project_name,
        "deployment_status": dep.status.value,
        "security_score": score,
        "score_label": label,
        "total_issues": len(report),
        "summary": {
            "critical": len(critical),
            "high": len(high),
            "medium": len(medium),
            "low": len(low),
        },
        "vulnerabilities": report,
        "advice": dep.security_advice or "",
    }

