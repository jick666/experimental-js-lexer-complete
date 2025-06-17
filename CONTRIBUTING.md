# Contributing via Codex Agents

1. Pick the highest-priority unchecked item in `docs/TODO_CHECKLIST.md`.
2. Read its spec in `docs/LEXER_SPEC.md`.
3. Run `npm run lint && npm test -- --coverage` to see failing tests.
4. Implement the functionality in the corresponding stub file.
5. Commit to a new branch named `reader/{{TOKEN_TYPE}}-impl` and open a PR.
6. Ensure CI (lint, tests, coverage ≥ 90%) passes before merging.
