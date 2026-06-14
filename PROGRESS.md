# InfraPilot — MVP Progress

> Last updated: 2026-06-14

---

## Phase 1: Backend Core ✅

The FastAPI backend is fully built and verified.

### What's Done

| Component | Status | Details |
|-----------|--------|---------|
| **PostgreSQL Database** | ✅ Done | Dockerized (port 5433), SQLAlchemy ORM |
| **GitHub OAuth** | ✅ Done | OAuth flow with `repo` scope for private repos |
| **Repository API** | ✅ Done | List repos, single repo details, branches |
| **Framework Detection** | ✅ Done | Next.js, React, FastAPI, Flask, Django, Docker, Static |
| **Dockerfile Generation** | ✅ Done | Per-framework templates, respects existing Dockerfiles |
| **Non-Root Docker Execution** | ✅ Done | Implemented `USER node` / `USER appuser` directives across all templates |
| **Docker Build & Run** | ✅ Done | Image build with streaming output, container lifecycle |
| **Deployment Pipeline** | ✅ Done | Clone → detect → scan → build → run → proxy (background task) |
| **Security Scanner** | ✅ Done | Secret detection, Dockerfile linting, security scoring |
| **AI Security Advisor** | ✅ Done | Gemini-powered remediation with Ollama + local fallbacks |
| **Live Logs (WebSocket)** | ✅ Done | Real-time log streaming with history replay |
| **Caddy Reverse Proxy** | ✅ Done | Admin API integration, graceful fallback if unavailable |
| **SHA-Anchored Subdomains** | ✅ Done | Subdomain names mapped to project name + 5-letter git commit SHA |
| **Deep Deletion & Cleanup** | ✅ Done | Stopping container, removing Caddy proxy, deleting Docker image, wiping git repo, and removing DB records |
| **CORS** | ✅ Done | Open for MVP, ready for frontend |

### API Endpoints (16)

```
GET     /                                    — Project info
GET     /health                              — Health check
GET     /auth/github                         — GitHub OAuth redirect
GET     /auth/callback                       — OAuth token exchange
GET     /repositories                        — List user repos
GET     /repositories/{owner}/{repo}         — Single repo details
GET     /repositories/{owner}/{repo}/branches — List branches
POST    /deploy                              — Start deployment
GET     /deployments                         — List all deployments
GET     /deploy/{id}                         — Deployment details
GET     /deploy/{id}/logs                    — Deployment logs
GET     /deploy/{id}/status                  — Container health check
GET     /deploy/{id}/security-advisor        — Security report + AI advice
POST    /deploy/{id}/approve                 — Approve after security review
POST    /deploy/{id}/redeploy                — Redeploy
DELETE  /deploy/{id}                         — Stop, remove & delete all assets
WS      /ws/logs/{id}                        — Live log stream
```

---

## Phase 2: BYOI / SSH Deployments 🔲

Deploy to user-owned servers via SSH.

| Component | Status | Details |
|-----------|--------|---------|
| Server registration API | 🔲 Todo | `POST /servers`, `GET /servers`, `DELETE /servers/{id}` |
| SSH connectivity test | 🔲 Todo | `POST /servers/{id}/test` |
| Remote deployment via SSH | 🔲 Todo | Clone, build, run on remote via Paramiko |
| Remote Caddy config | 🔲 Todo | Configure HTTPS on user's server |

---

## Phase 3: Frontend Dashboard ✅

Next.js 16 dashboard with warm light sand theme UI.

| Component | Status | Details |
|-----------|--------|---------|
| Landing page | ✅ Done | Hero, pipeline visualization, 3D scenes |
| GitHub login flow | ✅ Done | OAuth redirect + token storage in localStorage |
| Repository picker | ✅ Done | Browse & select repos with branch selection |
| Deploy wizard | ✅ Done | Choose repo, branch, and deploy |
| Deployment pipeline | ✅ Done | Visual step-by-step progress indicator |
| Live log viewer | ✅ Done | WebSocket-powered real-time logs + static fallback |
| Security report | ✅ Done | Findings list with severity badges + AI advice |
| Deployment history | ✅ Done | List, inspect, redeploy, delete |
| Status badges | ✅ Done | Color-coded badges for all pipeline states |
| Theme Unification | ✅ Done | Visual system mapped fully to globals.css color variables |
| Server management (BYOI) | 🔲 Todo | Add/remove/test SSH servers |

---

## Phase 4: Production Hardening 🔲

| Component | Status | Details |
|-----------|--------|---------|
| Custom domain support | 🔲 Todo | User-provided domains with auto-SSL |
| Auth middleware | 🔲 Todo | Protect endpoints, session management |
| Secrets management | 🔲 Todo | Encrypted SSH keys, env variable injection |
| Rate limiting | 🔲 Todo | Prevent abuse |
| Multi-node managed hosting | 🔲 Todo | Deploy across multiple servers |
| Auto-redeploy on push | 🔲 Todo | GitHub webhooks |
| Database migrations | 🔲 Todo | Alembic for schema versioning |

---

## Future Roadmap / Plans

### 1. Remote SSH Target Integration (BYOI)
Allow developers to register their personal VPS nodes (e.g. AWS EC2, DigitalOcean droplets) via SSH public key authentication. Deployments will be securely cloned, verified, containerized, and executed directly on the host's remote Docker engine using Python's `Paramiko` library.

### 2. Automatic Re-deployments (Webhooks)
Enable webhooks to listen for GitHub `push` events. Upon push, the platform will automatically trigger a new deployment pipeline: fetch the latest changes, run the security audit scanner, rebuild the Docker image, and update the running container with zero-downtime routing.

### 3. Continuous Infrastructure Security Audits
Perform hourly health checks on deployed container instances and external port exposures. Alert developers via email or Webhooks if an unauthorized port becomes publicly exposed on the host machine.
