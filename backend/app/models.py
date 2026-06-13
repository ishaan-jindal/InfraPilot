import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Text, DateTime, JSON, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class DeploymentStatus(str, enum.Enum):
    PENDING = "pending"
    CLONING = "cloning"
    DETECTING = "detecting"
    ANALYZING = "analyzing"
    BUILDING = "building"
    STARTING = "starting"
    CONFIGURING_PROXY = "configuring_proxy"
    RUNNING = "running"
    FAILED = "failed"
    STOPPED = "stopped"


class DeploymentTarget(str, enum.Enum):
    MANAGED = "managed"


class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_name = Column(String(255), nullable=False, index=True)
    repo_url = Column(String(512), nullable=False)
    branch = Column(String(255), default="main")
    commit_hash = Column(String(40), nullable=True)

    # Framework detection results
    framework = Column(String(100), nullable=True)
    build_command = Column(String(512), nullable=True)
    start_command = Column(String(512), nullable=True)
    port = Column(Integer, nullable=True)
    runtime = Column(String(100), nullable=True)

    # Deployment info
    status = Column(
        SAEnum(DeploymentStatus, name="deployment_status", create_constraint=True),
        default=DeploymentStatus.PENDING,
        nullable=False,
    )
    target = Column(
        SAEnum(DeploymentTarget, name="deployment_target", create_constraint=True),
        default=DeploymentTarget.MANAGED,
        nullable=False,
    )
    host_port = Column(Integer, nullable=True)  # Port on host machine
    container_id = Column(String(64), nullable=True)
    container_name = Column(String(255), nullable=True)
    subdomain = Column(String(255), nullable=True, unique=True)
    url = Column(String(512), nullable=True)

    # Logs & Security
    logs = Column(Text, default="")
    security_report = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
