# Agent Workflow Guide

This repository is optimized for iterative development by Codex agents.

## Local Setup
1. Install dependencies with `npm install` if not already present.
2. Use Node.js 18 or higher.

## Workflow Steps
1. Pick the highest priority unchecked task from `docs/TODO_CHECKLIST.md`.
2. Read the corresponding section in `docs/LEXER_SPEC.md` for implementation details.
3. Make changes in the `src` directory or related test files.
4. Before every commit, run:
   ```bash
   npm run lint && npm test -- --coverage
   ```
   Ensure test coverage stays above 90%.

## Commit Guidelines
- Use [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`).
- When implementing a token reader, create a branch named `reader/<TOKEN_TYPE>-impl`.
- Keep commits focused and small.

## Pull Requests
- Open a PR from your feature branch.
- Label the PR with `reader` so the auto‑merge workflow can process it.
- CI (lint, tests, coverage) must pass and at least one approving review is required.

Adhering to these guidelines will help Codex agents collaborate effectively on this project.
