# Repository Automation Overview

This directory centralizes all automation for the project.

## Workflows

GitHub Actions workflows live in the `workflows/` folder:

- `ci.yml` – runs lint and tests on every PR and push.
- `auto-merge.yml` – automatically merges PRs labeled `reader`.
- `agent-pr.yml` – posts a comment to kick off an agent when an issue is labeled `reader`.
- `benchmarks.yml` – nightly benchmark runs.
- `drift-check.yml` – checks that implemented readers match the specification.
- `generate-tests.yml` – regenerates tests when the spec changes.
- `publish-vscode.yml` – publishes the VS Code extension on releases.
- `release.yml` – performs semantic releases from `main`.
- `stale.yml` – marks inactive issues and PRs as stale.

## Scripts

Helper scripts used by workflows and local development are in `scripts/`:

- `prepare-husky.cjs` – installs Husky git hooks.
- `run-workflow.sh` – run lint, tests, and benchmarks locally.
- `next-task.cjs` – print the next unchecked todo item.
- `repo-info.cjs` – display repository info and open tasks.
- `check-drift.js` – open issues for spec/implementation drift.
- `compare-benchmark.js` – fail CI on benchmark regressions.
- `generate-tests.js` – placeholder for test generation from the spec.
- `check-coverage.js` – ensure test coverage meets the required threshold.

