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

## Automation Triggers
Agents respond to GitHub events via `.github/workflows/agent-workflow.yml`.

- **triage-agent** – runs on issue creation or comments. It closes completed
  reader TODOs and checks for spec drift.
- **codegen-agent** – runs on pull requests or manual dispatch to generate code
  via `agentic-automation.js`.
- **conflict-agent** – verifies `main` hasn’t advanced before a PR is opened.

Add the `reader` label or comment `/run-agent` on an issue to kick things off.

All helper scripts accept a `--dry-run` flag so agents can test without making
real API calls.

## Commit Guidelines
- Use [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`).
- Keep commits focused and small.

## Pull Requests
- Open a PR once your commits are ready.
- Label the PR with `reader` so the auto‑merge workflow can process it.
- CI (lint, tests, coverage) must pass and at least one approving review is required.

Adhering to these guidelines will help Codex agents collaborate effectively on this project.
