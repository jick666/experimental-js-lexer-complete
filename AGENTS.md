# Agent Workflow Guide

This repository is optimized for iterative development by Codex agents.

## Local Setup
1. Install dependencies with `npm install` if not already present.
2. Use Node.js 18 or higher.

## Workflow Steps
1. Choose an open issue or propose a new enhancement.
2. Review `docs/TASK_BREAKDOWN.md` for historical context if needed.
3. Consult `docs/LEXER_SPEC.md` and other docs for background.
4. Implement code changes in `src/` and update or add tests under `tests/`.
5. Before every commit, run:
   ```bash
   npm run lint && npm test -- --coverage
   ```
   Ensure test coverage stays above 90%.
6. (Optional) Run **all** checks in one go:

   ```bash
   npm run workflow   # requires GitHub creds; otherwise just lint & tests run
   ```

## Commit Guidelines
- Use [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`).
- Keep commits focused and small.

## Pull Requests
- Open a PR once your commits are ready.
- Label the PR with `reader` so the auto‑merge workflow can process it.
- CI (lint, tests, coverage) must pass and at least one approving review is required.

Adhering to these guidelines will help Codex agents collaborate effectively on this project.

## Agent Jobs

### Triage Agent
- **Triggers:** `issues` opened or labeled, and new `issue_comment` events.
- **Inputs:** operates on issues labeled `todo`, `drift`, or `reader`.
- **Outputs:** may close `todo` issues and open new `reader` issues when drift is detected.
- **Dry-Run:** run `node .github/scripts/close-todo.js --dry-run` and `node .github/scripts/check-drift.js --dry-run` to test locally without API calls.

### Codegen Agent
- **Triggers:** `pull_request` events and manual `workflow_dispatch`.
- **Inputs:** current repository state plus the `OPENAI_API_KEY` and `GITHUB_TOKEN` secrets from the environment.
- **Outputs:** commits automated updates on a new branch.
- **Dry-Run:** run `npm run workflow` locally to verify lint, tests, and benchmarks. Commit any generated changes manually.

### Conflict Agent
- **Triggers:** runs after the codegen agent.
- **Inputs:** compares the recorded `main` branch SHA to detect divergence.
- **Outputs:** aborts with an error if `main` has moved; otherwise opens a pull request.
- **Dry-Run:** invoke the conflict check steps with `--dry-run` on the helper scripts; no PR will be opened.
