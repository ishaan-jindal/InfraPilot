# InfraPilot — MVP Progress

> Last updated: 2026-06-13

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
| **Docker Build & Run** | ✅ Done | Image build with streaming output, container lifecycle |
| **Deployment Pipeline** | ✅ Done | Clone → detect → scan → build → run → proxy (background task) |
| **Security Scanner** | ✅ Done | Secret detection, Dockerfile linting, security scoring |
| **AI Security Advisor** | ✅ Done | Gemini-powered remediation with Ollama + local fallbacks |
| **Live Logs (WebSocket)** | ✅ Done | Real-time log streaming with history replay |
| **Caddy Reverse Proxy** | ✅ Done | Admin API integration, graceful fallback if unavailable |
| **Deployment Management** | ✅ Done | List, inspect, redeploy, delete deployments |
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
│   ├── models.py           ← Deployment model + enums
│   ├── github.py           ← OAuth + repository routes
│   ├── deploy.py           ← Deployment pipeline & endpoints
│   ├── detector.py         ← Framework detection
│   ├── docker_utils.py     ← Dockerfile gen, build, run, stop
│   ├── repo_manager.py     ← Git clone & commit extraction
│   ├── security.py         ← Secret scanner, Dockerfile linter, AI advisor
│   ├── caddy.py            ← Caddy reverse proxy management
│   └── ws.py               ← WebSocket live log streaming
├── .env / .env.example
└── requirements.txt
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

Next.js 16 dashboard with dark theme UI.

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
| Server management (BYOI) | 🔲 Todo | Add/remove/test SSH servers |

### Frontend File Structure

```
frontend/src/
├── app/
│   ├── page.tsx                           ← Landing page
│   ├── layout.tsx                         ← Root layout + fonts
│   ├── globals.css                        ← Design system + CSS variables
│   ├── auth/callback/page.tsx             ← OAuth callback handler
│   └── dashboard/
│       ├── layout.tsx                     ← Sidebar layout
│       ├── page.tsx                       ← Deployment list (main dashboard)
│       ├── deploy/page.tsx                ← Deploy wizard
│       └── deployments/[id]/page.tsx      ← Deployment detail + logs
├── components/
│   ├── Navbar.tsx, Hero.tsx, Footer.tsx   ← Landing page components
│   └── dashboard/
│       ├── Sidebar.tsx                    ← Navigation sidebar
│       ├── LogViewer.tsx                  ← Live/static log viewer
│       ├── DeploymentPipeline.tsx         ← Visual pipeline progress
│       ├── SecurityReport.tsx             ← Security findings + AI advice
│       └── StatusBadge.tsx                ← Status indicator badges
└── lib/
    ├── api.ts                             ← Backend API client (fetch + WebSocket)
    ├── auth.ts                            ← Token management helpers
    └── types.ts                           ← TypeScript type definitions
```

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

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Postgres │  │   Frontend   │  │  Caddy Reverse   │   │
│  │ :5433    │  │ Next.js :3000│  │  Proxy (host net) │   │
│  └──────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────┘
         │                                    │
         │            ┌──────────────┐        │
         └────────────│   Backend    │────────┘
                      │ FastAPI :8000│
                      │  (local)     │
                      └──────┬───────┘
                             │
                      ┌──────┴───────┐
                      │ Docker Engine│
                      │ (user apps)  │
                      └──────────────┘
```

- **PostgreSQL** — Dockerized database on port 5433
- **Frontend** — Dockerized Next.js standalone app on port 3000
- **Caddy** — Dockerized reverse proxy on host network for deployed apps
- **Backend** — Runs locally via `uvicorn` with direct access to Docker CLI
- **User Apps** — Built and run as Docker containers by the backend

---

## Quick Start

```bash
# 1. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GEMINI_API_KEY

# 2. Start infrastructure (DB, frontend, Caddy)
docker compose up -d

# 3. Start the backend locally
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload

# 4. Open http://localhost:3000
```
