#!/usr/bin/env sh
set -e
root=$(git rev-parse --show-toplevel 2>/dev/null || true)
if [ -z "$root" ]; then
  root=${GROK_WORKSPACE_ROOT:-${CLAUDE_PROJECT_DIR:-}}
fi
if [ -z "$root" ]; then
  root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
fi
exec node "$root/scripts/session-start-jobs.cjs"
