#!/bin/bash
APP_URL="${APP_URL:-http://localhost:3000}"

echo "=== Health Check ==="

# Check if process is running
if pm2 pid nextapp > /dev/null 2>&1; then
  echo "✓ PM2 process running"
else
  echo "✗ PM2 process NOT running — run: pm2 start .next/standalone/server.js --name nextapp"
fi

# Check HTTP response
STATUS=$(curl -o /dev/null -s -w "%{http_code}" "$APP_URL")
if [ "$STATUS" = "200" ]; then
  echo "✓ Homepage returns 200"
else
  echo "✗ Homepage returned HTTP $STATUS"
fi

# Check admin page reachable (should redirect to login, i.e. 200 or 307)
ADMIN=$(curl -o /dev/null -s -w "%{http_code}" "$APP_URL/admin")
if [ "$ADMIN" = "200" ] || [ "$ADMIN" = "307" ] || [ "$ADMIN" = "302" ]; then
  echo "✓ Admin page reachable (HTTP $ADMIN)"
else
  echo "✗ Admin page returned HTTP $ADMIN"
fi

# Check static assets load
STATIC=$(curl -o /dev/null -s -w "%{http_code}" "$APP_URL/_next/static/chunks/main.js" 2>/dev/null || echo "000")
if [ "$STATIC" = "200" ]; then
  echo "✓ Static JS assets loading"
else
  echo "✗ Static assets not loading (HTTP $STATIC) — rerun: node scripts/standalone-setup.mjs"
fi

echo "=== Done ==="
