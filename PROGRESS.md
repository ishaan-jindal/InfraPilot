# InfraPilot — MVP Progress

> Last updated: 2026-06-12

---

## Phase 1: Backend Core ✅

The FastAPI backend is fully built and verified.

### What's Done

| Component | Status | Details |
|-----------|--------|---------|
| **PostgreSQL Database** | ✅ Done | SQLAlchemy ORM, auto-migration on startup |
| **GitHub OAuth** | ✅ Done | OAuth flow with `repo` scope for private repos |
| **Repository API** | ✅ Done | List repos, single repo details, branches |
| **Framework Detection** | ✅ Done | Next.js, React, FastAPI, Flask, Django, Docker, Static |
| **Dockerfile Generation** | ✅ Done | Per-framework templates, respects existing Dockerfiles |
| **Docker Build & Run** | ✅ Done | Image build with streaming output, container lifecycle |
| **Deployment Pipeline** | ✅ Done | Clone → detect → build → run → proxy (background task) |
| **Live Logs (WebSocket)** | ✅ Done | Real-time log streaming with history replay |
| **Caddy Reverse Proxy** | ✅ Done | Admin API integration, graceful fallback if unavailable |
| **Deployment Management** | ✅ Done | List, inspect, redeploy, delete deployments |
| **CORS** | ✅ Done | Open for MVP, ready for frontend |

### API Endpoints (14)

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
POST    /deploy/{id}/redeploy                — Redeploy
DELETE  /deploy/{id}                         — Stop & remove
WS      /ws/logs/{id}                        — Live log stream
```

### Backend File Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py            ← FastAPI app, CORS, lifespan, routers
│   ├── config.py           ← Environment config
│   ├── database.py         ← SQLAlchemy engine & session
│   ├── models.py           ← Deployment model
│   ├── github.py           ← OAuth + repository routes
│   ├── deploy.py           ← Deployment pipeline & endpoints
│   ├── detector.py         ← Framework detection
│   ├── docker_utils.py     ← Dockerfile gen, build, run, stop
│   ├── repo_manager.py     ← Git clone & commit extraction
│   ├── caddy.py            ← Caddy reverse proxy management
│   └── ws.py               ← WebSocket live log streaming
├── .env
├── requirements.txt
└── setup_db.sh
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

Next.js dashboard for managing deployments.

| Component | Status | Details |
|-----------|--------|---------|
| GitHub login flow | ✅ Done | OAuth redirect + token storage |
| Repository picker | ✅ Done | Browse & select repos |
| Deploy wizard | ✅ Done | Choose target, review plan, deploy |
| Live log viewer | ✅ Done | WebSocket-powered real-time logs |
| Deployment history | ✅ Done | List, inspect, redeploy, delete |
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

---

## Quick Start

```bash
# 1. Provide your secrets in an environment file
cp backend/.env.example backend/.env
# Edit backend/.env to include your GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GEMINI_API_KEY

# 2. Start the database (Ensure PostgreSQL is running locally)

# 3. Start the backend
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# 4. Start the frontend & proxy
cd ..
docker compose up -d
```
