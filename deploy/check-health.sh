#!/bin/bash
set -euo pipefail

APP_PORT="${APP_PORT:-5050}"
APP_URL="${APP_URL:-https://ssgpharma.com}"
INTERNAL_URL="http://127.0.0.1:${APP_PORT}"

echo "=== Health Check ==="

status_code() {
  curl -o /dev/null -s -w "%{http_code}" "$1" 2>/dev/null || echo "000"
}

if pm2 pid nextapp >/dev/null 2>&1; then
  echo "✓ PM2 process running"
else
  echo "✗ PM2 process NOT running — run: APP_PORT=${APP_PORT} pm2 startOrReload deploy/ecosystem.config.cjs --env production"
fi

INTERNAL_STATUS="$(status_code "$INTERNAL_URL")"
if [ "$INTERNAL_STATUS" = "200" ]; then
  echo "✓ Internal app returns 200 on ${INTERNAL_URL}"
else
  echo "✗ Internal app returned HTTP ${INTERNAL_STATUS} on ${INTERNAL_URL}"
fi

EXTERNAL_STATUS="$(status_code "$APP_URL")"
if [ "$EXTERNAL_STATUS" = "200" ]; then
  echo "✓ External homepage returns 200 on ${APP_URL}"
else
  echo "✗ External homepage returned HTTP ${EXTERNAL_STATUS} on ${APP_URL}"
fi

ADMIN_STATUS="$(status_code "${APP_URL}/admin")"
if [ "$ADMIN_STATUS" = "200" ] || [ "$ADMIN_STATUS" = "302" ] || [ "$ADMIN_STATUS" = "307" ]; then
  echo "✓ Admin page reachable (HTTP ${ADMIN_STATUS})"
else
  echo "✗ Admin page returned HTTP ${ADMIN_STATUS}"
fi

ASSET_PATH="$(curl -s "$APP_URL" | sed -n 's/.*\(\"\/_next\/static\/[^\"]*\.js\"\).*/\1/p' | tr -d '"' | head -n 1)"
if [ -n "$ASSET_PATH" ]; then
  STATIC_STATUS="$(status_code "${APP_URL}${ASSET_PATH}")"
else
  STATIC_STATUS="000"
fi

if [ "$STATIC_STATUS" = "200" ]; then
  echo "✓ Static JS assets loading"
else
  echo "✗ Static assets not loading (HTTP ${STATIC_STATUS}) — rerun: node scripts/standalone-setup.mjs"
fi

echo "=== Done ==="
