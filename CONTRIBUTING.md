# Contributing via Codex Agents

1. Choose an open issue or propose a new enhancement.
2. Read its spec in `docs/LEXER_SPEC.md`.
3. Run `npm run lint && npm test -- --coverage` to see failing tests.
4. Implement the functionality in the corresponding stub file.
5. Commit directly to the shared branch and open a PR.
6. Label the PR with `reader` to enable the auto‑merge workflow.
7. Ensure CI (lint, tests, coverage ≥ 90%) passes and obtain at least one approving review.
8. Once these requirements are met, the **Auto‑Merge Reader PRs** action will squash merge the PR automatically.
9. Comment `/run-agent` on an issue to trigger the multi-agent workflow manually.
