#!/usr/bin/env bash

set -euo pipefail

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required"
  exit 1
fi

if [[ "$DATABASE_URL" == file:* ]]; then
  db_path="${DATABASE_URL#file:}"
  db_dir="$(dirname "$db_path")"

  if [[ -n "$db_dir" && "$db_dir" != "." ]]; then
    mkdir -p "$db_dir"
  fi
fi

pnpm exec prisma migrate deploy
exec node .next/standalone/server.js
