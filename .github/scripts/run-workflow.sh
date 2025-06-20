#!/usr/bin/env bash
set -euo pipefail

# 1. Ensure correct Node version and install deps
node -v     # confirm Node >=18
npm run install

# 2. Lint, test with coverage, and benchmark
npm run lint
npm test -- --coverage
node .github/scripts/check-coverage.js
npm run bench

# 3. Display coverage summary
grep -A1 "All files" coverage/lcov-report/index.html || true

echo "Workflow checks complete."
