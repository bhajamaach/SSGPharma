#!/bin/bash
set -euo pipefail

DOMAIN="${DOMAIN:-ssgpharma.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.ssgpharma.com}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"

if [ -z "$CERTBOT_EMAIL" ]; then
  echo "ERROR: CERTBOT_EMAIL is required."
  echo "Usage: CERTBOT_EMAIL=you@example.com bash deploy/setup-ssl.sh"
  exit 1
fi

echo "=== Issuing TLS certificate for ${DOMAIN} and ${WWW_DOMAIN} ==="
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --redirect \
  --email "$CERTBOT_EMAIL" \
  -d "$DOMAIN" \
  -d "$WWW_DOMAIN"

echo "=== Validating Certbot renewal configuration ==="
sudo certbot renew --dry-run

echo "=== SSL setup complete ==="
echo "Visit: https://${DOMAIN}"
