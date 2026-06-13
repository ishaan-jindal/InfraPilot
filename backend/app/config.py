from dotenv import load_dotenv
import os

load_dotenv()

# GitHub OAuth
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://infrapilot:infrapilot@localhost:5432/infrapilot")

# Deployment
DEPLOY_BASE_DIR = os.getenv("DEPLOY_BASE_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "deployments"))
REPOS_BASE_DIR = os.getenv("REPOS_BASE_DIR", os.path.join(os.path.dirname(os.path.dirname(__file__)), "repos"))

# Caddy
CADDY_API_URL = os.getenv("CADDY_API_URL", "http://localhost:2019")
BASE_DOMAIN = os.getenv("BASE_DOMAIN", "localhost")

# Port range for managed deployments
PORT_RANGE_START = int(os.getenv("PORT_RANGE_START", "9000"))
PORT_RANGE_END = int(os.getenv("PORT_RANGE_END", "9500"))

# Gemini LLM Integration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Ollama LLM Integration (Fallback)
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")
