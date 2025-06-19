# Agent Workflow Guide 🚀

This repository is tuned for **autonomous, high-quality iteration** by OpenAI Codex agents.

---

## 1 · Local Setup
1. **Node 18+** required.  
2. Install once:


## 2 · Daily Loop
Step	What to do	Why it matters
1	Select the next unchecked box in docs/TODO_CHECKLIST.md.	Keeps work aligned with project priorities.
2	Read the matching section(s) in docs/LEXER_SPEC.md, docs/PLUGIN_API.md, etc.	Guarantees spec-compliant changes.
3	Implement code in src/, tests in tests/.	Source–test co-location.
4	Before every commit run:
npm run check	Lint ✓ Tests ✓ ≥90 % coverage ✓ ≤10 % benchmark regression ✓
5	Push a branch and open a PR.	Continuous integration kicks in.
6	No manual labels needed – the labeler bot tags reader automatically.	Triggers auto-merge once CI passes + one review.

## 3 · Commit Conventions
Follow Conventional Commits:

feat:     add <ReaderName>  
fix:      correct <bug>  
docs:     update spec / README  
refactor: internal change, no behaviour impact  
test:     add or improve tests  
chore:    tooling, CI, meta
Small, focused commits help future agents reason about changes.

##  4 · Gotchas & Tips
Coverage dip? add tests or refactor existing ones – CI blocks < 90 %.

Benchmark fail? optimise or justify in the PR description.

Need context? Every PR gets an auto-comment quoting the relevant spec lines.

Unsure what to do next? run npm run next-task for the highest-priority TODO.

Happy hacking! 🎉