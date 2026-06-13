import os
import re
from typing import List, Dict, Optional

# Basic regex patterns for secret detection
SECRET_PATTERNS = {
    "AWS Access Key": re.compile(r"(?i)aws_access_key_id\s*={1,2}\s*['\"]?(AKIA[0-9A-Z]{16})['\"]?"),
    "AWS Secret Key": re.compile(r"(?i)aws_secret_access_key\s*={1,2}\s*['\"]?([a-zA-Z0-9/+=]{40})['\"]?"),
    "Generic Stripe Key": re.compile(r"sk_live_[0-9a-zA-Z]{24}"),
    "Generic OpenAI Key": re.compile(r"sk-[a-zA-Z0-9]{48}"),
    "Slack Token": re.compile(r"xox[baprs]-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24}"),
    "Generic Secret in .env": re.compile(r"(?i)(password|secret|key|token)\s*=\s*['\"]?([a-zA-Z0-9\-_]{8,})['\"]?")
}

IGNORE_DIRS = {".git", "node_modules", "venv", ".venv", "__pycache__", "build", "dist"}


def scan_secrets(repo_dir: str) -> List[Dict]:
    """
    Recursively scans the directory for files that might contain secrets.
    """
    vulnerabilities = []

    for root, dirs, files in os.walk(repo_dir):
        # Modify dirs in-place to skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for file in files:
            file_path = os.path.join(root, file)
            # Try to read as text file
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    for line_num, line in enumerate(f, start=1):
                        for secret_type, pattern in SECRET_PATTERNS.items():
                            match = pattern.search(line)
                            if match:
                                # Check if it's just a generic .env secret match but the file is not .env or similar
                                if secret_type == "Generic Secret in .env" and not (file.endswith(".env") or "config" in file.lower() or "secret" in file.lower()):
                                    continue
                                
                                rel_path = os.path.relpath(file_path, repo_dir)
                                vulnerabilities.append({
                                    "severity": "CRITICAL",
                                    "type": "LEAKED_SECRET",
                                    "description": f"Found potential {secret_type}",
                                    "file": rel_path,
                                    "line": line_num,
                                    "snippet": line.strip()[:100]  # truncate to avoid dumping huge lines
                                })
            except UnicodeDecodeError:
                # Binary file, skip
                pass
            except Exception:
                pass

    return vulnerabilities


def scan_dockerfile(dockerfile_path: str, repo_dir: str) -> List[Dict]:
    """
    Scans a Dockerfile for common misconfigurations.
    """
    vulnerabilities = []
    if not os.path.exists(dockerfile_path):
        return vulnerabilities

    rel_path = os.path.relpath(dockerfile_path, repo_dir)

    try:
        with open(dockerfile_path, "r", encoding="utf-8") as f:
            content = f.read()
            lines = content.splitlines()

            has_user = False
            for line_num, line in enumerate(lines, start=1):
                stripped = line.strip().upper()
                if stripped.startswith("USER "):
                    has_user = True
                if stripped.startswith("EXPOSE "):
                    # Check for dangerous ports
                    parts = line.strip().split()
                    if len(parts) > 1:
                        port = parts[1]
                        if port in ("22", "3306", "5432", "6379"):
                            vulnerabilities.append({
                                "severity": "HIGH",
                                "type": "DANGEROUS_PORT_EXPOSED",
                                "description": f"Dockerfile exposes potentially dangerous port: {port}",
                                "file": rel_path,
                                "line": line_num,
                                "snippet": line.strip()
                            })

            if not has_user:
                vulnerabilities.append({
                    "severity": "HIGH",
                    "type": "CONTAINER_RUNS_AS_ROOT",
                    "description": "No USER directive found. Container will run as root.",
                    "file": rel_path,
                    "line": None,
                    "snippet": None
                })

    except Exception:
        pass

    return vulnerabilities


def run_security_scan(repo_dir: str, dockerfile_content: Optional[str] = None) -> List[Dict]:
    """
    Runs the full security scan on a repository.
    Returns a list of vulnerability dictionaries.
    """
    vulnerabilities = []
    
    # 1. Scan for secrets
    vulnerabilities.extend(scan_secrets(repo_dir))

    # 2. Scan Dockerfile
    # In the current pipeline, dockerfile is written to repo_dir/Dockerfile
    dockerfile_path = os.path.join(repo_dir, "Dockerfile")
    if os.path.exists(dockerfile_path):
        vulnerabilities.extend(scan_dockerfile(dockerfile_path, repo_dir))
    
    return vulnerabilities
