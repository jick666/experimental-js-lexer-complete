# Agent Workflow Guide 🚀

This repository is tuned for **autonomous, high-quality iteration** by OpenAI Codex agents.


## 1 · Local setup
1. Install **Node 18 or 20** (LTS).  
2. One-time deps:



## 2 · Daily loop
Step	What to do	Why it matters
1	Tick the next unchecked item in docs/TODO_CHECKLIST.md.	Keeps work aligned with the roadmap.
2	Read the matching spec section(s) in docs/LEXER_SPEC.md, docs/PLUGIN_API.md, etc.	Guarantees spec-compliant changes.
3	Implement code in src/, tests in tests/.	Source ↔ test proximity.
4	Before every commit run:

bash\nnpm run check\n	Lint ✓ Tests ✓ Benchmarks ✓
5	Push a branch & open a PR.	CI kicks in automatically.
6	The labeler bot adds reader – auto-merge when CI passes & one review is present.	Hands-free merging.

## 3 · Commit conventions
Follow Conventional Commits:


feat:      add <ReaderName>
fix:       correct <bug>
docs:      update spec / README
refactor:  internal change, no behaviour impact
test:      add or improve tests
chore:     tooling, CI, meta
Small, focused commits help future agents reason about changes.

## 4 · Gotchas & tips
Coverage < 90 %? -- add tests or refactor; CI will block you.

Benchmark regression > 10 %? -- optimise or justify in the PR description.

Run npm run next-task for the highest-priority TODO.

Happy hacking! 🎉
