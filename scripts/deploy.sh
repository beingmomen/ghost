#!/usr/bin/env bash
# Builds and (re)starts only the apps that changed — the CloudPanel/VPS equivalent
# of Coolify's watch_paths. The workflow writes apps/*/.env before calling this.
#
#   deploy.sh all    -> build & (re)start all three (first deploy / manual)
#   deploy.sh auto    -> build only the apps touched since the last pull (default)
set -euo pipefail

export HOME="${HOME:-/root}"   # the runner service starts with no HOME set
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# BEFORE/AFTER/EVENT are supplied by the workflow from the git context. The
# workflow already synced the repo (git reset --hard origin/main) before this runs.
BEFORE="${BEFORE:-}"
AFTER="${AFTER:-$(git rev-parse HEAD)}"
EVENT="${EVENT:-manual}"

if [ "$EVENT" != "push" ] || [ -z "$BEFORE" ] || echo "$BEFORE" | grep -qE '^0+$'; then
  CHANGED="ALL"   # first deploy / manual run -> build everything
else
  CHANGED="$(git diff --name-only "$BEFORE" "$AFTER" 2>/dev/null || echo ALL)"
fi
echo "changed: $CHANGED"

# GIGET_AUTH (for apps/db base-layer) comes from the db env file the workflow wrote.
if [ -f apps/db/.env ]; then set -a; . apps/db/.env; set +a; fi

BUILD_ALL=0
if [ "$CHANGED" = "ALL" ] || echo "$CHANGED" | grep -q '^pnpm-lock.yaml$'; then
  echo "== pnpm install =="
  pnpm install --frozen-lockfile
  BUILD_ALL=1
fi

want() { [ "$BUILD_ALL" = 1 ] || echo "$CHANGED" | grep -q "^$1/"; }

# Built sequentially (never in parallel) — two Nuxt builds at once exhaust RAM.
if want apps/client; then
  echo "== build client =="
  set -a; . apps/client/.env; set +a   # BASE_URL must be present at build time (CSP)
  NODE_OPTIONS=--max-old-space-size=4096 pnpm build:client
  pm2 startOrRestart ecosystem.config.cjs --only client --update-env
fi

if want apps/db; then
  echo "== build db =="
  set -a; . apps/db/.env; set +a       # GIGET_AUTH for the base-layer fetch
  NODE_OPTIONS=--max-old-space-size=4096 pnpm build:db
  pm2 startOrRestart ecosystem.config.cjs --only db --update-env
fi

if want apps/server; then
  echo "== build server =="
  pnpm build:server
  pm2 startOrRestart ecosystem.config.cjs --only server --update-env
fi

pm2 save
echo "== deploy done =="
