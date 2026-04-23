#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/app}"
REPO_URL="${REPO_URL:-}"  # set via: REPO_URL=https://github.com/you/repo.git bash deploy/first-deploy.sh
APP_PORT="${APP_PORT:-5050}"

if [ -z "$REPO_URL" ]; then
  echo "ERROR: Set REPO_URL environment variable before running this script."
  echo "Usage: REPO_URL=https://github.com/youruser/yourrepo.git bash deploy/first-deploy.sh"
  exit 1
fi

echo "=== Cloning repository ==="
if [ -d "$APP_DIR/.git" ]; then
  echo "ERROR: $APP_DIR already contains a git repository."
  echo "Use deploy/deploy.sh for subsequent updates."
  exit 1
fi
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

echo "=== Copying environment file ==="
if [ ! -f .env ]; then
  cp .env.example .env
  echo "IMPORTANT: Edit $APP_DIR/.env with your production values before continuing."
  echo "Press Enter when done..."
  read
fi

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo "=== Running database migrations ==="
pnpm prisma migrate deploy

echo "=== Building for production ==="
export NEXT_DEPLOYMENT_ID="${NEXT_DEPLOYMENT_ID:-$(git rev-parse --short HEAD)-$(date +%s)}"
pnpm build:standalone

echo "=== Starting application with PM2 ==="
APP_PORT="$APP_PORT" pm2 startOrReload deploy/ecosystem.config.cjs --env production

pm2 save
echo "=== First deploy complete. App running on port ${APP_PORT}. ==="
