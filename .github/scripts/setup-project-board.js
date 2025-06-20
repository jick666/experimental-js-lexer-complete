#!/usr/bin/env node
/**
 * Ensure a classic GitHub project board named PROJECT_NAME (defaults to
 * “Automation”) exists in the current repository and that it contains the
 * canonical Todo / In Progress / Done columns.
 *
 * ─── Environment ──────────────────────────────────────────────────────────────
 *   • GITHUB_REPOSITORY  owner/repo   (injected by GitHub Actions)
 *   • TOKEN              personal-access token **OR** one of:
 *       – GITHUB_TOKEN   (default Actions token – add projects:write permission)
 *       – GH_TOKEN
 *       – GITHUB_PAT
 *   • PROJECT_NAME       optional – board name (defaults to “Automation”)
 *
 * Why fall back to those names?  Because other automation in this repo already
 * uses `GITHUB_TOKEN` (see release workflow) and some external “agent” runners
 * set only `GH_TOKEN`.  Normalising here lets every runner succeed without any
 * extra wiring.
 */

import process from 'node:process';
import { Octokit } from '@octokit/rest';

//───────────────────────────────────────────────────────────────────────────────
// 1. Token & repo sanity checks
//───────────────────────────────────────────────────────────────────────────────
const token =
  process.env.TOKEN ??
  process.env.GITHUB_TOKEN ??
  process.env.GH_TOKEN ??
  process.env.GITHUB_PAT;

const repoFull = process.env.GITHUB_REPOSITORY;
const boardName = process.env.PROJECT_NAME || 'Automation';

if (!token || !repoFull) {
  console.error(
    'setup-project-board → missing TOKEN/GITHUB_TOKEN and/or GITHUB_REPOSITORY – aborting.',
  );
  process.exit(1); // hard-fail so CI surfaces the problem
}

const [owner, repo] = repoFull.split('/');

// One octokit instance with the inertia preview header needed for “classic” projects.
const octokit = new Octokit({
  auth: token,
  userAgent: 'setup-project-board-script',
  request: { mediaType: { previews: ['inertia'] } },
});

//───────────────────────────────────────────────────────────────────────────────
// 2. Helpers
//───────────────────────────────────────────────────────────────────────────────
const listProjects = () =>
  octokit.paginate(octokit.rest.projects.listForRepo, { owner, repo });

const listColumns = (project_id) =>
  octokit.paginate(octokit.rest.projects.listColumns, { project_id });

async function ensureColumns(project_id) {
  const existing = await listColumns(project_id);
  const required = ['Todo', 'In Progress', 'Done'];

  await Promise.all(
    required.map(async (name) => {
      if (existing.some((c) => c.name === name)) return;
      await octokit.rest.projects.createColumn({ project_id, name });
      console.log(`  ↳ created “${name}” column`);
    }),
  );
}

//───────────────────────────────────────────────────────────────────────────────
// 3. Main
//───────────────────────────────────────────────────────────────────────────────
(async () => {
  try {
    // (a) Find or create the board
    const projects = await listProjects();
    let board = projects.find((p) => p.name === boardName);

    if (!board) {
      board = (
        await octokit.rest.projects.createForRepo({
          owner,
          repo,
          name: boardName,
          body: 'Automated classic project board created by CI',
        })
      ).data;
      console.log(`Created project board “${boardName}” (#${board.id})`);
    } else {
      console.log(`Project board “${boardName}” already exists (#${board.id})`);
    }

    // (b) Verify the canonical columns
    await ensureColumns(board.id);
    console.log('Columns verified ✔');

  } catch (error) {
    // Most frequent cause when running inside Actions is a token without the
    //   “projects:write” permission.
    if (error.status === 403 || error.status === 404) {
      console.error(`
❌  GitHub refused the Projects API call.
   • When using the default \`GITHUB_TOKEN\` inside Actions
     add an explicit permissions block to the workflow:
         permissions:
           projects: write
   • For personal-access tokens, be sure “repo” and “project” scopes are enabled.
`);
    }
    throw error;
  }
})();
