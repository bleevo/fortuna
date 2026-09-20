#!/usr/bin/env bash
# Push Fortuna to https://github.com/bleevo/fortuna
# Run from a clone of this repo (Cursor Origin or after restoring the bundle).
set -euo pipefail

REPO_URL="${GITHUB_REPO_URL:-https://github.com/bleevo/fortuna.git}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Run this from inside the Fortuna git repo."
  exit 1
fi

if ! git remote get-url github >/dev/null 2>&1; then
  git remote add github "$REPO_URL"
else
  git remote set-url github "$REPO_URL"
fi

echo "Remotes:"
git remote -v
echo
echo "Pushing main and feature branch to GitHub..."
git push -u github main
git push -u github cursor/fortuna-pension-calculator-09bf
echo
echo "Done. Open: $REPO_URL"
