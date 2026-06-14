# InfraPilot — Walkthrough

This document walks you through setting up and running InfraPilot locally for development.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker & Docker Compose | Latest | Database, frontend, Caddy proxy |
| Python | 3.12+ | Backend runtime |
| Node.js | 20+ | Frontend development (hot reload) |
| Git | Latest | Repository cloning |

You will also need:
- A **GitHub OAuth App** — [Create one here](https://github.com/settings/developers)
  - Homepage URL: `http://localhost:3000`
  - Callback URL: `http://localhost:3000/auth/callback`
- (Optional) A **Google AI Studio API key** for Gemini-powered security advice — [Get one here](https://aistudio.google.com/apikey)

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/ishaan-jindal/InfraPilot.git
cd InfraPilot
```

---

## Step 2: Configure Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your credentials:

```env
# Required
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
DATABASE_URL=postgresql://infrapilot:infrapilot@localhost:5433/infrapilot

# Optional (enables AI-powered security advice)
GEMINI_API_KEY=your_gemini_api_key

# Defaults (usually no changes needed)
CADDY_API_URL=http://localhost:2019
BASE_DOMAIN=localhost
PORT_RANGE_START=9000
PORT_RANGE_END=9500
```

> **Note:** The database port is `5433` (not the default `5432`) to avoid conflicts with any local PostgreSQL installation.

---

## Step 3: Start Docker Services

```bash
docker compose up -d
```

This starts three containers:

| Service | Port | Description |
|---------|------|-------------|
| `db` | 5433 | PostgreSQL 16 database |
| `frontend` | 3000 | Next.js production build |
| `caddy` | 80, 443, 2019 | Reverse proxy for deployed apps |

Verify they're running:

```bash
docker compose ps
```

---

## Step 4: Set Up the Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload
```

The backend starts on `http://localhost:8000`. You can verify at:
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

> **Why is the backend not in Docker?** The backend needs native access to the Docker CLI to build and run user application containers. Running Docker-inside-Docker adds unnecessary complexity.

---

## Step 5: Use the Application

### 1. Open the Dashboard

Navigate to **http://localhost:3000**

### 2. Sign in with GitHub

Click "Sign in with GitHub" on the landing page. This redirects you through GitHub's OAuth flow and stores your access token locally.

### 3. Deploy a Repository

1. Click **"New Deployment"** in the dashboard sidebar
2. Select a repository from your GitHub account
3. Choose a branch (defaults to `main`)
4. Click **"Deploy"**

### 4. Watch the Pipeline

The deployment detail page shows a real-time pipeline:

```
Clone → Detect → Scan → Build → Start → Proxy
```

Each step updates live via WebSocket. The log viewer streams build output in real time.

### 5. Security Review

If the security scan finds issues, the pipeline pauses at **"Awaiting Approval"**:

- Review the security findings (secrets, Docker misconfigs)
- Read AI-generated remediation advice
- Click **"Approve & Continue"** to proceed with deployment

### 6. Access Your Deployed App

Once deployed, the app runs in a Docker container on a dynamically allocated port (9000–9500). If Caddy is running, a subdomain route is automatically configured.

---

## Deployment Pipeline Details

The full deployment pipeline consists of these stages:

| Stage | Status | What Happens |
|-------|--------|--------------|
| **Clone** | `cloning` | Clones the GitHub repo (with token for private repos) |
| **Detect** | `detecting` | Identifies the framework (Next.js, React, Flask, etc.) |
| **Scan** | `scanning` | Runs security checks: secret detection + Dockerfile linting |
| **Review** | `awaiting_approval` | Pauses if critical/high findings are detected |
| **Build** | `building` | Builds a Docker image from the generated Dockerfile |
| **Start** | `starting` | Runs the container on an available port |
| **Proxy** | `configuring_proxy` | Registers the app with Caddy for reverse proxying |
| **Done** | `running` | App is live and accessible |

---

## Security Scanner

The security scan runs automatically during deployment and checks for:

### Secret Detection
- AWS Access Key IDs and Secret Keys
- OpenAI API keys
- Stripe live keys
- Slack tokens
- GitHub personal access tokens
- Committed `.env` files
- Generic hardcoded secrets in config files

### Dockerfile Analysis
- Running as root (no `USER` directive)
- Exposing unnecessary ports

### Security Score
- Starts at **100/100**
- Deductions: CRITICAL (-25), HIGH (-15), MEDIUM (-5), LOW (-2)
- Score labels: Excellent (90+), Good (75+), Fair (50+), Poor (25+), Critical Risk (<25)

### AI Remediation
- **Primary:** Google Gemini generates specific fix commands and code changes
- **Fallback 1:** Local Ollama LLM
- **Fallback 2:** Built-in template with actionable remediation steps

---

## Useful Commands

```bash
# View all running containers (infrastructure + deployed apps)
docker ps

# View backend logs
uvicorn app.main:app --reload  # (runs in foreground with auto-reload)

# View frontend/db/caddy logs
docker compose logs frontend --tail 50
docker compose logs db --tail 50

# Restart everything
docker compose down && docker compose up -d

# Reset the database
docker compose exec db psql -U infrapilot -d infrapilot -c "TRUNCATE TABLE deployments;"

# Check database schema
docker compose exec db psql -U infrapilot -d infrapilot -c "\d deployments"
```

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Port 5432 already in use | The Docker DB uses port **5433** to avoid conflicts. Ensure `DATABASE_URL` in `.env` uses port 5433. |
| `cannot import name 'genai'` | Run `pip install google-genai` in your backend venv. |
| Frontend shows blank dashboard | Ensure the backend is running on port 8000. The frontend expects `NEXT_PUBLIC_API_URL=http://localhost:8000`. |
| Deployment fails at "Build" | The backend needs native Docker CLI access. Don't run the backend inside a Docker container. |
| WebSocket disconnects immediately | The deployment may have already finished. Switch to the "Build Logs" tab to see static logs. |
| GitHub OAuth 404 | Ensure `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set in `backend/.env`. |
| Database column missing | The schema auto-creates on first startup. If you added new model fields, manually ALTER the table or recreate the DB: `docker compose down -v && docker compose up -d` |

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Docker Compose                          │
│  ┌────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │ PostgreSQL │  │    Frontend    │  │   Caddy Reverse    │  │
│  │   :5433    │  │ Next.js :3000  │  │   Proxy (host net) │  │
│  └────────────┘  └────────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                                      │
          │              ┌──────────────┐         │
          └──────────────│   Backend    │─────────┘
                         │ FastAPI :8000│
                         │   (local)    │
                         └──────┬───────┘
                                │
                         ┌──────┴───────┐
                         │ Docker Engine│
                         │ (user apps)  │
                         └──────────────┘
```

**Why this split?**
- The backend runs **locally** because it needs direct access to the Docker CLI to build and manage user application containers.
- The database, frontend, and Caddy run in **Docker** for easy setup and consistency.
- User-deployed applications run as **separate Docker containers** managed by the backend.

---

## Security and Deletion Upgrades (2026-06-14)

Several improvements were made to address the `RUNS AS ROOT` vulnerability, enable full asset cleanup upon deployment deletion, use commit-anchored subdomains, and uniform the frontend theme:

### 1. Docker Vulnerability Mitigation (Non-root Templates)
Every framework template generated by the backend now explicitly configures and runs as a non-root user to mitigate host takeover vulnerabilities:
- **Next.js, Node.js & Static**: Uses the built-in Alpine `node` user (UID 1000). All copied build assets are recursively chowned (`--chown=node:node`) to node, and the process is restricted by the `USER node` directive.
- **Python Frameworks (FastAPI, Flask, Django)**: Creates a system user/group `appuser` (UID/GID 10001) and applies `USER appuser` at the execution stage.

### 2. Complete Asset Cleanup on Deletion
When a deployment is deleted, the backend now performs a comprehensive filesystem, Docker, and database cleanup:
1. Stops and removes the active container.
2. Removes the dynamic Caddy reverse proxy routing configuration.
3. Deletes the built Docker image (`infrapilot-[project-name]:latest`) from host storage.
4. Recursively deletes the cloned git repository folder from the host filesystem (`repos/[project-name]`).
5. Removes the record completely from the PostgreSQL database.

### 3. Git Commit-Anchored Subdomains
Subdomain mapping is now linked directly to the git history:
- When a deployment is queued, it is initially assigned a temporary unique subdomain (`[project-name]-temp-[random-id]`) to prevent database unique constraint collisions.
- As soon as the git repository is cloned, the pipeline extracts the HEAD commit SHA and updates the subdomain to `[project-name]-[5-letter-commit-sha]`.
- Suffix-incrementing collision handling is built-in to handle duplicate deploys of the same commit.

### 4. Cohesive Frontend Theme Uniforming
The frontend styling was audited and aligned with the design system tokens:
- **Color Variables**: Defined missing color tokens (`--color-accent-blue`, `--color-accent-coral`, and `--color-accent-green`) inside `@theme` and `:root` configuration in `globals.css`.
- **Status Badges**: Refactored status badge rendering from generic Tailwind colors (like `text-blue-400`, `text-emerald-400`) to use design system variables (e.g. `text-[var(--color-accent-blue)]`, `text-[var(--color-severity-pass)]`).
- **Security Report & Pipeline**: Mapped severity levels and pipeline state colors to custom theme colors, resulting in a cohesive, professional warm light/sand theme.
