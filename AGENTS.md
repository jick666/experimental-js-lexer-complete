# Agent Workflow Guide

This repository is optimized for iterative development by Codex agents.

## Local Setup
1. Install dependencies with `npm install` if not already present.
2. Use Node.js 18 or higher.

## Workflow Steps
1. Pick the highest priority unchecked item in `docs/TODO_CHECKLIST.md`.
2. Review the matching section in `docs/TASK_BREAKDOWN.md` for granular subtasks.
3. Consult `docs/LEXER_SPEC.md` and other docs for background.
4. Implement code changes in `src/` and update or add tests under `tests/`.
5. Before every commit, run:
   ```bash
   npm run lint && npm test -- --coverage
   ```
   Ensure test coverage stays above 90%.

## Commit Guidelines
- Use [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`).
- Keep commits focused and small.

## Pull Requests
- Open a PR once your commits are ready.
- Label the PR with `reader` so the auto‑merge workflow can process it.
- CI (lint, tests, coverage) must pass and at least one approving review is required.

Adhering to these guidelines will help Codex agents collaborate effectively on this project.
