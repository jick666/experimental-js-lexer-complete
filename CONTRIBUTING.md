# Contributing via Codex Agents

1. Choose an open issue or propose a new enhancement.
2. Read its spec in `docs/LEXER_SPEC.md`.
3. Run `npm run setup-board` once to create the project board.
4. Run `npm run lint && npm test -- --coverage` to see failing tests.
5. Implement the functionality in the corresponding stub file.
6. Commit directly to the shared branch and open a PR.
7. Label the PR with `reader` to enable the auto‑merge workflow.
8. Ensure CI (lint, tests, coverage ≥ 90%) passes and obtain at least one approving review.
9. Once these requirements are met, the **Auto‑Merge Reader PRs** action will squash merge the PR automatically.
