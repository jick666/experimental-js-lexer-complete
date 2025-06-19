#!/usr/bin/env bash
set -euo pipefail

# 1. Ensure correct Node version and install deps
node -v     # confirm Node >=18
npm install

# 2. Sync project board and seed issues (optional setup)
npm run sync:project

# 3. Lint, test with coverage, and benchmark
npm run lint
npm test -- --coverage
npm run bench

# 4. Display coverage summary
grep -A1 "All files" coverage/lcov-report/index.html || true

echo "Workflow checks complete."
