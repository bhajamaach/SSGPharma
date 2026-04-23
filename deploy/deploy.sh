#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
APP_PORT="${APP_PORT:-5050}"
cd "$APP_DIR"

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Installing dependencies ==="
pnpm install --frozen-lockfile

echo "=== Running database migrations ==="
pnpm prisma migrate deploy

echo "=== Building for production ==="
export NEXT_DEPLOYMENT_ID="${NEXT_DEPLOYMENT_ID:-$(git rev-parse --short HEAD)-$(date +%s)}"
pnpm build:standalone

echo "=== Reloading application on port ${APP_PORT} ==="
APP_PORT="$APP_PORT" pm2 startOrReload deploy/ecosystem.config.cjs --env production
pm2 save

echo "=== Deploy complete ==="
pm2 status
