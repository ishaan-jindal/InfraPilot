import os
import re
import json
from typing import List, Dict, Optional
import requests
from google import genai
from app.config import OLLAMA_URL, OLLAMA_MODEL

# Secret scanning regexes
AWS_KEY_PATTERN = re.compile(r"AKIA[0-9A-Z]{16}")
AWS_SECRET_PATTERN = re.compile(r"(?i)aws_secret_access_key\s*=\s*['\"]?([a-zA-Z0-9/+=]{40})['\"]?")
OPENAI_KEY_PATTERN = re.compile(r"sk-[a-zA-Z0-9]{48}")
STRIPE_KEY_PATTERN = re.compile(r"sk_live_[0-9a-zA-Z]{24}")
SLACK_TOKEN_PATTERN = re.compile(r"xox[baprs]-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24}")
GITHUB_TOKEN_PATTERN = re.compile(r"ghp_[a-zA-Z0-9]{36}")
GENERIC_SECRET_PATTERN = re.compile(r"(?i)(password|secret|token|api_key)\s*=\s*['\"]?([a-zA-Z0-9\-_]{8,})['\"]?")

def scan_secrets(repo_dir: str) -> List[Dict]:
    """
    Scans the repository directory for leaked secrets.
    """
    issues = []
    
    # Check if directory exists
    if not os.path.exists(repo_dir):
        return issues

    for root, dirs, files in os.walk(repo_dir):
        # Exclude directories we shouldn't scan
        dirs[:] = [d for d in dirs if d not in ('.git', '.venv', '__pycache__', 'node_modules', '.next', 'dist', 'build')]
        
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, repo_dir).replace('\\', '/')
            
            # Check for committed .env files
            if file == '.env' or file.endswith('.env'):
                issues.append({
                    "severity": "CRITICAL",
                    "type": "LEAKED_SECRET",
                    "file": rel_path,
                    "message": f"Environment file '{rel_path}' is committed to the repository. This is a severe security risk as it typically contains passwords, keys, and credentials."
                })
                continue
                
            # Scan text files for secret patterns
            try:
                # Read file content safely
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line_num, line in enumerate(f, 1):
                        # Find AWS Access Key IDs
                        aws_matches = AWS_KEY_PATTERN.findall(line)
                        for match in aws_matches:
                            issues.append({
                                "severity": "CRITICAL",
                                "type": "LEAKED_SECRET",
                                "file": rel_path,
                                "message": f"Potential AWS Access Key ID leaked on line {line_num}: {match[:8]}..."
                            })

                        # Find AWS Secret Access Keys
                        aws_secret_matches = AWS_SECRET_PATTERN.findall(line)
                        for match in aws_secret_matches:
                            issues.append({
                                "severity": "CRITICAL",
                                "type": "LEAKED_SECRET",
                                "file": rel_path,
                                "message": f"Potential AWS Secret Access Key leaked on line {line_num}."
                            })

                        # Find OpenAI API keys
                        openai_matches = OPENAI_KEY_PATTERN.findall(line)
                        for match in openai_matches:
                            issues.append({
                                "severity": "CRITICAL",
                                "type": "LEAKED_SECRET",
                                "file": rel_path,
                                "message": f"Potential OpenAI API Key leaked on line {line_num}: {match[:8]}..."
                            })

                        # Find Stripe Live keys
                        stripe_matches = STRIPE_KEY_PATTERN.findall(line)
                        for match in stripe_matches:
                            issues.append({
                                "severity": "CRITICAL",
                                "type": "LEAKED_SECRET",
                                "file": rel_path,
                                "message": f"Potential Stripe Live Secret Key leaked on line {line_num}: {match[:12]}..."
                            })

                        # Find Slack tokens
                        slack_matches = SLACK_TOKEN_PATTERN.findall(line)
                        for match in slack_matches:
                            issues.append({
                                "severity": "CRITICAL",
                                "type": "LEAKED_SECRET",
                                "file": rel_path,
                                "message": f"Potential Slack Token leaked on line {line_num}: {match[:12]}..."
                            })

                        # Find GitHub personal access tokens
                        github_matches = GITHUB_TOKEN_PATTERN.findall(line)
                        for match in github_matches:
                            issues.append({
                                "severity": "CRITICAL",
                                "type": "LEAKED_SECRET",
                                "file": rel_path,
                                "message": f"Potential GitHub Personal Access Token leaked on line {line_num}: {match[:12]}..."
                            })

                        # Find generic secrets in config/env files
                        if file.endswith(('.env', '.cfg', '.ini', '.conf')) or 'config' in file.lower():
                            generic_matches = GENERIC_SECRET_PATTERN.findall(line)
                            for key, _ in generic_matches:
                                issues.append({
                                    "severity": "HIGH",
                                    "type": "LEAKED_SECRET",
                                    "file": rel_path,
                                    "message": f"Potential hardcoded '{key}' value found on line {line_num}."
                                })
            except Exception:
                # Ignore files that can't be read (binary files, symlinks, etc.)
                pass
                
    return issues


def lint_dockerfile(dockerfile_content: str, expected_port: Optional[int] = None) -> List[Dict]:
    """
    Lints a Dockerfile's content to identify security risks and misconfigurations.
    """
    issues = []
    has_user = False
    exposed_ports = []
    
    lines = dockerfile_content.splitlines()
    for line in lines:
        line = line.strip()
        if not line or line.startswith('#'):
            continue
            
        parts = line.split(maxsplit=1)
        if not parts:
            continue
            
        instruction = parts[0].upper()
        if instruction == 'USER':
            has_user = True
        elif instruction == 'EXPOSE':
            if len(parts) > 1:
                ports = parts[1].split()
                for p in ports:
                    # Clean the port from protocols like /tcp or /udp
                    p_clean = p.split('/')[0]
                    try:
                        exposed_ports.append(int(p_clean))
                    except ValueError:
                        pass

    if not has_user:
        issues.append({
            "severity": "HIGH",
            "type": "RUNS_AS_ROOT",
            "file": "Dockerfile",
            "message": "No USER directive found in Dockerfile. The containerized application will run as the 'root' user by default. If a vulnerability is exploited, the attacker could gain full root access to the container host."
        })
        
    for port in exposed_ports:
        if expected_port is not None and port != expected_port:
            issues.append({
                "severity": "MEDIUM",
                "type": "UNNECESSARY_PORT_EXPOSED",
                "file": "Dockerfile",
                "message": f"Dockerfile exposes port {port}, but the detected framework port is {expected_port}. Exposing unnecessary ports increases the attack surface."
            })
            
    return issues


def run_security_scan(repo_dir: str, dockerfile_content: str = "", expected_port: Optional[int] = None) -> List[Dict]:
    """
    Runs both secret scanning and Dockerfile linting.
    Handles a missing or empty Dockerfile gracefully.
    """
    findings = []
    findings.extend(scan_secrets(repo_dir))
    if dockerfile_content and dockerfile_content.strip():
        findings.extend(lint_dockerfile(dockerfile_content, expected_port))
    return findings


# ---------------------------------------------------------------------------
# Security Score
# ---------------------------------------------------------------------------

# Points deducted per finding severity
_SEVERITY_PENALTY = {
    "CRITICAL": 25,
    "HIGH": 15,
    "MEDIUM": 5,
    "LOW": 2,
}

def calculate_security_score(findings: List[Dict]) -> int:
    """
    Calculates a security score between 0 and 100.

    Scoring logic:
      Start at 100.
      Deduct points per finding based on severity:
        CRITICAL  → -25 per finding
        HIGH      → -15 per finding
        MEDIUM    →  -5 per finding
        LOW       →  -2 per finding
      Floor at 0.

    Returns an integer score.
    """
    score = 100
    for finding in findings:
        severity = finding.get("severity", "LOW")
        penalty = _SEVERITY_PENALTY.get(severity, 2)
        score -= penalty
    return max(0, score)


def get_score_label(score: int) -> str:
    """Returns a human-readable risk label for a given score."""
    if score >= 90:
        return "Excellent"
    elif score >= 75:
        return "Good"
    elif score >= 50:
        return "Fair"
    elif score >= 25:
        return "Poor"
    else:
        return "Critical Risk"



def _generate_ollama_advice(prompt: str) -> str:
    """
    Sends the prompt to a local Ollama instance for generation.
    Returns the response string on success, or empty string on failure.
    """
    url = f"{OLLAMA_URL.rstrip('/')}/api/generate"
    try:
        response = requests.post(
            url,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False
            },
            timeout=10
        )
        if response.status_code == 200:
            return response.json().get("response", "")
    except Exception:
        pass
    return ""


def generate_remediation_advice(findings: List[Dict], api_key: Optional[str] = None) -> str:
    """
    Generates developer-friendly remediation advice using Gemini.
    If Gemini fails, falls back to local Ollama.
    If Ollama is not running, falls back to a generated local template.
    """
    if not findings:
        return "### 🎉 No security vulnerabilities detected!\n\nYour code and configuration passed all security gate checks."
        
    prompt = f"""You are an expert DevSecOps AI. The user is trying to deploy an application, but we found the following vulnerabilities:
{json.dumps(findings, indent=2)}

Explain these risks in plain English and provide the exact terminal commands or code changes needed to fix them.
Be extremely specific, structured, and write your response in beautiful, clean Markdown.
Use code blocks for commands or code changes, and separate your advice by file or issue.
"""

    # 1. Try Gemini (google-genai SDK)
    if api_key:
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=prompt,
            )
            return response.text
        except Exception:
            pass

    # 2. Try Ollama (Local LLM fallback)
    ollama_advice = _generate_ollama_advice(prompt)
    if ollama_advice:
        return f"*(Generated by local Ollama model: {OLLAMA_MODEL})*\n\n" + ollama_advice

    # 3. Try Local fallback template
    return _generate_local_advice(findings)


def _generate_local_advice(findings: List[Dict]) -> str:
    """
    Generates a localized, highly readable Markdown fallback remediation advice.
    """
    lines = [
        "## 🛡️ Security Advisor Remediation Report",
        "",
        "We scanned your codebase and Docker configuration and detected security issues that must be addressed or reviewed before deployment.",
        ""
    ]
    
    # Group findings by type
    secrets = [f for f in findings if f["type"] == "LEAKED_SECRET"]
    root_runs = [f for f in findings if f["type"] == "RUNS_AS_ROOT"]
    ports = [f for f in findings if f["type"] == "UNNECESSARY_PORT_EXPOSED"]
    
    if secrets:
        lines.append("### 🔑 Leaked Secrets & Environment Files")
        lines.append("")
        for s in secrets:
            lines.append(f"#### 🛑 {s['message']}")
            lines.append(f"- **File:** `{s['file']}`")
            lines.append(f"- **Severity:** `{s['severity']}`")
            lines.append("")
        lines.append("#### **How to Fix:**")
        lines.append("1. **Remove Committed `.env` files:**")
        lines.append("   Stop tracking `.env` in Git immediately to prevent it from being pushed to public or private repos:")
        lines.append("   ```bash")
        lines.append("   # Remove from git cache (keeps the local file, but untracks it)")
        lines.append("   git rm --cached .env")
        lines.append("   # Commit this change")
        lines.append("   git commit -m \"chore: remove env file from tracking\"")
        lines.append("   ```")
        lines.append("2. **Revoke and Rotate Exposed Keys:**")
        lines.append("   If any AWS or OpenAI keys were exposed, go to your cloud console / API dashboard, delete the exposed credentials, and generate new keys.")
        lines.append("3. **Use Environment Variables:**")
        lines.append("   Provide credentials through the server environment or a secure vault rather than committing them in plain text.")
        lines.append("")
        
    if root_runs:
        lines.append("### 🐳 Docker Container Runs as Root")
        lines.append("")
        for r in root_runs:
            lines.append(f"#### ⚠️ {r['message']}")
            lines.append(f"- **File:** `{r['file']}`")
            lines.append(f"- **Severity:** `{r['severity']}`")
            lines.append("")
        lines.append("#### **How to Fix:**")
        lines.append("To avoid running your container as the root user, define a non-root user and switch to it using the `USER` instruction in your Dockerfile.")
        lines.append("")
        lines.append("For example, for **Node.js/Next.js** applications:")
        lines.append("```dockerfile")
        lines.append("# Create a system user and group, and change permissions")
        lines.append("USER node")
        lines.append("```")
        lines.append("")
        lines.append("For **Python (FastAPI/Flask/Django)** applications:")
        lines.append("```dockerfile")
        lines.append("# Create a non-privileged user")
        lines.append("RUN adduser --disabled-password --gecos \"\" appuser")
        lines.append("USER appuser")
        lines.append("```")
        lines.append("")
        
    if ports:
        lines.append("### 🔌 Unnecessary Ports Exposed")
        lines.append("")
        for p in ports:
            lines.append(f"#### ⚠️ {p['message']}")
            lines.append(f"- **File:** `{p['file']}`")
            lines.append(f"- **Severity:** `{p['severity']}`")
            lines.append("")
        lines.append("#### **How to Fix:**")
        lines.append("Remove the `EXPOSE` line for the unused ports or align it with your application's actual port.")
        lines.append("")
        
    return "\n".join(lines)
