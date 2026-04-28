#!/usr/bin/env bash

set -euo pipefail

if [[ "${CONFIRM_RESET_DB:-}" != "reset-render-db" ]]; then
  echo "Refusing to reset database."
  echo "Run with CONFIRM_RESET_DB=reset-render-db when you intentionally want to wipe the Render SQLite DB."
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required"
  exit 1
fi

if [[ "$DATABASE_URL" != file:* ]]; then
  echo "This reset script only supports SQLite file: DATABASE_URL values."
  exit 1
fi

db_path="${DATABASE_URL#file:}"
db_dir="$(dirname "$db_path")"

mkdir -p "$db_dir"
rm -f "$db_path" "$db_path-journal" "$db_path-shm" "$db_path-wal"
touch "$db_path"

echo "Rebuilding SQLite database at $db_path"
pnpm exec prisma migrate deploy --schema prisma/schema.prisma

echo "Database reset complete: $db_path"
