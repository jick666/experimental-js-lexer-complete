AGENTS.md
(Only the Codegen Agent inputs line was changed.)

## Agent Workflow Guide

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

   npm run lint && npm test -- --coverage
Ensure test coverage stays above 90%.
6. (Optional) Run all checks in one go:


npm run workflow   # requires GitHub creds; otherwise just lint & tests run
Commit Guidelines
Use Conventional Commits (feat, fix, docs, style, refactor, perf, test, chore).

Keep commits focused and small.

Pull Requests
Open a PR once your commits are ready.

Label the PR with reader so the auto-merge workflow can process it.

CI (lint, tests, coverage) must pass and at least one approving review is required.

Adhering to these guidelines will help Codex agents collaborate effectively on this project.

##Agent Jobs
All automation uses the labels defined in .github/labeler.yml: todo, drift, and reader. Commands such as /run-agent should be left as comments on issues or PRs to manually trigger the workflow.

##Triage Agent
Triggers: issues (opened, labeled) and issue_comment (created).

Inputs: issues labeled todo, drift, or reader.

Outputs: closes completed todo issues and opens new reader issues when drift is detected.

Dry-Run: node .github/scripts/close-todo.js --dry-run and node .github/scripts/check-drift.js --dry-run.

##Codegen Agent
Triggers: pull_request (opened, synchronize) or workflow_dispatch.

Inputs: repository state plus GITHUB_TOKEN and GITHUB_REPOSITORY from the environment.

Outputs: commits automated updates on a branch. The conflict agent opens the pull request after verifying no divergence.

Dry-Run: node agentic-automation.js --dry-run.

##Conflict Agent
Triggers: runs after the codegen agent before opening the PR.

Inputs: compares the recorded main branch SHA to detect divergence.

Outputs: fails the workflow if main has moved so the branch can be rebased.

Dry-Run: run the conflict check steps with --dry-run; no PR will be opened.


Adjusted from the original :contentReference[oaicite:9]{index=9}.

