# Contributing via Codex Agents

1. Select the highest-priority unchecked box in **`docs/TODO_CHECKLIST.md`**.  
2. Study the spec in **`docs/LEXER_SPEC.md`**.  
3. Run `npm run ci` to reproduce the current test suite locally.  
4. Implement the change (code ➜ `src/`, tests ➜ `tests/`).  
5. Push a branch `reader/<TOKEN>-impl` and open a PR **labeled `reader`**.  
6. CI (lint + tests + coverage) must be green and one review required.

The **Auto-Merge Reader PRs** action will squash-merge automatically when the above pass.
