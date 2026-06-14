# InfraPilot

### Own Your Infrastructure. Verify Its Security.

[![Live Demo](https://img.shields.io/badge/Live-Demo-3D5AFE?style=for-the-badge)](https://infrapilot.ishaanjindal.tech/)
[![GitHub License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

InfraPilot is a secure deployment platform that solves the critical trade-off between managed ease-of-use and self-hosted control. It analyzes repositories, audits infrastructure configuration, scores your security posture out of 100, offers AI-powered remediation advice, and deploys applications securely—to either our managed environment or your own self-hosted VPS.

---

## 🚀 Live Demo
Access the live hackathon deployment at: **[https://infrapilot.ishaanjindal.tech/](https://infrapilot.ishaanjindal.tech/)**

---

## 💡 The Pitch

Modern PaaS solutions (Vercel, Netlify, Railway) make deployment incredibly simple, but offer developers **zero visibility into security posture** and lock them into proprietary ecosystems. Alternatively, deploying to self-hosted VPS instances gives developers full ownership but demands **complex security management**—often leaving SSH, firewalls, and Docker configurations exposed to severe vulnerabilities.

**InfraPilot bridges this gap.** 
It treats **security as the foundation** and **deployment as the resulting action**. Before a single line of code goes live, InfraPilot runs static analysis, audits Docker configurations, checks for leaked credentials, pauses on critical issues, suggests fixes, and secures the deployment surface.

---

## 🛠️ The Architecture

```
                    GitHub Repo
                        │
                        ▼
                Security Audit Stage
         (Secrets / Docker configs / Ports)
                        │
          Awaiting Approval / Gated (If Critical)
                        │
                        ▼
           Docker Build Stage (Non-Root User)
                        │
                        ▼
            Caddy Reverse Proxy Routing
              (SSL / Dynamic Subdomains)
       ┌────────────────┴────────────────┐
       ▼                                 ▼
Managed Infrastructure          Bring Your Own Server
(Dynamic Containers)            (Self-Hosted Linux VM)
```

---

## ✨ Core Features

### 🛡️ 1. Infrastructure Security Score
A single, standardized rating from **0–100** summarizing the security configuration of your code and environment. Deductions are dynamically applied based on severity levels (Critical, High, Medium, Low) for issues like exposed secrets or root-privileged Docker containers.

### 🔑 2. Proactive Secret Leak Detection
Scanning engine looking for AWS Access Keys, OpenAI API keys, Stripe tokens, Slack credentials, and GitHub PATs. It prevents developers from pushing hardcoded secrets or committed `.env` files.

### 🐳 3. Hardened Docker Containerization
- **Vulnerability Remediation**: All framework templates automatically implement the `USER` directive (`node` for Node/NextJS/Static environments and a custom `appuser` system account for Python/FastAPI/Flask/Django apps), stopping container-escape exploits.
- **Rootless Execution**: Files are built, copied, and executed under restricted permissions, leaving host daemons safe from attack.

### 🤖 4. AI Security Advisor
Integrates Google Gemini to explain identified security risks in plain language and provides developers with immediate, drop-in config edits and command remediation steps before deployment.

### 🌐 5. Dynamic Subdomains & Asset Cleanups
- **SHA-Anchored Subdomains**: Automatically provisions subdomains mapped to the git commit hash (e.g. `[project-name]-[commit-sha-prefix]`).
- **Deep Deletion**: Deleting a deployment stops/removes the container, deletes the Docker image, frees disk space by deleting local repositories, and deletes PostgreSQL records.

---

## 💻 Supported Frameworks
InfraPilot automatically detects and provisions:
- **Next.js** (Multi-stage build)
- **React & Vite-React** (Built and served via single-page static runner)
- **FastAPI / Flask / Django** (Python WSGI/ASGI configurations)
- **Generic Dockerfile Projects**
- **Static HTML/CSS/JS websites**

---

## ⚙️ Quick Start (Local Development)

### Prerequisites
- Docker & Docker Compose
- Python 3.12+ (with a virtual environment)
- Node.js 20+ (for frontend development)
- A GitHub OAuth Application ([Create one here](https://github.com/settings/developers))

### 1. Clone & Configure
```bash
git clone https://github.com/ishaan-jindal/InfraPilot.git
cd InfraPilot
cp backend/.env.example backend/.env
```
Edit the `backend/.env` file and supply your GitHub OAuth keys, Gemini API token, and postgres credentials.

### 2. Launch Local Database & Proxy
```bash
docker compose up -d
# Starts: PostgreSQL (port 5433), NextJS Frontend (port 3000), Caddy reverse proxy
```

### 3. Run the Backend API Natively
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# Backend will spin up on http://localhost:8000
```

### 4. Deploy!
Go to **http://localhost:3000**, authenticate with GitHub, pick a repository, and audit your first secure deployment.

---

## 📈 Vision & Future Roadmap
InfraPilot's ultimate goal is to become the **de facto Cybersecurity Control Plane for Self-Hosted Clouds**.
1. **Bring Your Own Infrastructure (BYOI)**: Deploy to your own remote VPS over SSH.
2. **Dynamic Port Scan Validation**: Periodically run host network audits.
3. **Automated Git Hook Webhooks**: Instantly rebuild and scan on every git push.
4. **Vulnerability CVE Feed Integration**: Match packages against real-time vulnerability databases.
