# experimental-js-lexer

A modular, adaptive, experimental JavaScript lexer designed for autonomous development by OpenAI Codex agents.

## Quick Start

See `QUICK_START.md` for setup and development guidelines.

### Pre-commit
Run `npm install` once to set up Husky hooks. Commits will automatically run `npm run lint` and `npm test` before being created.

### Workflow Helper
Use the convenience script to run linting, tests, and benchmarks in one go. All automation scripts and CI workflows live under `.github/`.

npm run workflow
Repository Info
Print an overview of available scripts and open tasks:


npm run repo-info
Agent Workflow
Automated agents coordinate through GitHub branches. A typical session:

Sync with main:

git fetch origin
git checkout main
git reset --hard origin/main
Create a new branch named agent/<date>-<TASK_ID>.

Before editing, rebase to the latest main:

git pull --rebase origin main
Abort and resync if conflicts occur.

Run checks locally:

npm run lint && npm test
After committing, rebase onto main again and rerun the checks.

Push the branch and open a pull request using the GITHUB_TOKEN.
