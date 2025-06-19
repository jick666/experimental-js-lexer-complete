**`README.md`**  
(Inserted **Agent Workflow** before Code of Conduct and updated step 6.)  

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

## Agent Workflow

Agents coordinate entirely through Git operations and local checks:

1. **Sync with main**
   ```bash
   git fetch origin
   git checkout main
   git reset --hard origin/main
   ```
2. **Create a feature branch** – `agent/<date>-<TASK_ID>`
3. **Rebase before edits**
   ```bash
   git pull --rebase origin main || { git rebase --abort && exit 1; }
   ```
4. **Run checks**
   ```bash
   npm run lint
   npm test -- --coverage
   ```
5. Commit, rebase once more onto `main`, rerun the checks.
6. **Push and open a PR** using the provided `GITHUB_TOKEN`.
