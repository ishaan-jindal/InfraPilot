#!/bin/bash
# InfraPilot — Database Setup Script
# Run this script to create the PostgreSQL database and user.

set -e

echo "=== InfraPilot Database Setup ==="

echo "Creating PostgreSQL user 'infrapilot'..."
sudo -u postgres psql -c "CREATE USER infrapilot WITH PASSWORD 'infrapilot';" 2>/dev/null || echo "User already exists"

echo "Creating database 'infrapilot'..."
sudo -u postgres psql -c "CREATE DATABASE infrapilot OWNER infrapilot;" 2>/dev/null || echo "Database already exists"

echo "Granting privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE infrapilot TO infrapilot;" 2>/dev/null || echo "Privileges already granted"

echo ""
echo "=== Testing connection ==="
psql -U infrapilot -d infrapilot -h localhost -c "SELECT 'Connection successful!' as status;" 2>&1 || echo "Note: You may need to configure pg_hba.conf for password authentication"

echo ""
echo "=== Done ==="
echo "You can now start the backend with:"
echo "  cd backend && .venv/bin/uvicorn app.main:app --reload"
