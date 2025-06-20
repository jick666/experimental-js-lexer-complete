#!/usr/bin/env bash
set -euo pipefail

echo "🔧  Codex setup script running…"

###############################################################################
# 1. Ensure a Node version that matches the CI matrix (≥20.x)
###############################################################################
if command -v nvm &>/dev/null; then
  # Align with the lowest CI version so local hooks/tests behave identically.
  nvm install 20 >/dev/null
  nvm use 20
fi

required_major=20
active_major=$(node -v | sed -E 's/^v([0-9]+).*/\1/')
if (( active_major < required_major )); then
  echo "❌  Node ${required_major}+ required (CI runs 20 & 22); found v${active_major}." >&2
  exit 1
fi
echo "🖥️   Using Node $(node --version)"

###############################################################################
# 2. Install dependencies **with** lifecycle scripts so Husky can self-install
###############################################################################
echo "📦  Installing NPM packages…"
if [[ -f package-lock.json ]]; then
  npm ci --no-audit --no-fund
else
  npm install --no-audit --no-fund
fi

if [[ ! -f .husky/pre-commit ]]; then
  echo "🔄  Husky hooks missing – running npm run prepare…"
  npm run prepare --if-present
fi

###############################################################################
# 3. Prime caches (non-blocking – failures ignored)
###############################################################################
npm run lint --if-present || true
npm test -- --coverage --silent || true

###############################################################################
# 4. (Optional) Mirror CI’s top-level helper targets – safe to comment out
###############################################################################
npm run workflow --if-present || true
npm run repo-info --if-present || true

###############################################################################
# 5. Persist GITHUB_TOKEN for runtime helpers (if provided) and setup board
###############################################################################
if [[ -n "${GITHUB_TOKEN:-}" ]]; then
  echo "export GITHUB_TOKEN=${GITHUB_TOKEN}" >> ~/.bashrc
  git config --global url."https://${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
  echo "📋  Attempting to set up project board…"
  npm run setup-board || echo "⚠️  Board setup failed (possibly due to network restrictions)."
fi

echo "✅  Setup finished – agent ready!"
