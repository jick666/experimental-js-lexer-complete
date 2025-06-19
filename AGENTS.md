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

## Automated Agent Workflow
The `agent-all.yml` workflow listens on issues, comments, pull requests and manual dispatch events. Trigger it by commenting `/run-agent` on an issue or by labeling issues with `todo` or `drift`. The workflow performs triage and then runs code generation.

Jobs run in the following order:
1. **checkout_and_setup** – checks out the repo and installs dependencies.
2. **triage** – runs `close-todo.js` or `check-drift.js` based on labels.
3. **agentic_automation** – executes `agentic-automation.js`, pushes a branch and opens a PR.

All automation scripts accept a `--dry-run` flag for testing. The workflow creates `.agent.lock` to avoid concurrent runs and removes it on completion.

Adhering to these guidelines will help Codex agents collaborate effectively on this project.
