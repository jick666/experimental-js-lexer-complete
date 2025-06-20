#!/usr/bin/env node
/**
 * Provision a project board for this repository.
 *
 * ▸ First we try the Classic Projects REST API (still the simplest way to get a
 *   Trello-style board with Todo / In Progress / Done).  We always attempt that
 *   call **with the default GITHUB_TOKEN** that GitHub Actions injects, because:
 *        • Fine-grained PATs cannot call Classic Projects REST (410 Gone).
 *        • The Actions token *can* call it as long as the job requests
 *          `permissions: projects: write`.
 *
 * ▸ If Classic Projects are disabled or the call returns 410/403 we *gracefully
 *   skip* instead of failing the entire CI job.  This lets you migrate to the
 *   new Projects v2 later without breaking existing workflows.
 *
 * Environment variables inspected
 * ─────────────────────────────────────────────────────────────────────────────
 *   • GITHUB_REPOSITORY   owner/repo     (always present in Actions)
 *   • GITHUB_TOKEN        *Actions* token – used **only** for board calls
 *   • GH_TOKEN / TOKEN    any personal token – used for log messages if set
 *   • PROJECT_NAME        optional board name (default: "Automation")
 */

import process from 'node:process';
import { Octokit } from '@octokit/rest';

const repoFull   = process.env.GITHUB_REPOSITORY;
const boardName  = process.env.PROJECT_NAME || 'Automation';
const actionsTok = process.env.GITHUB_TOKEN;        // Fine-grained PAT **not** used here
const logTok     = process.env.GH_TOKEN || process.env.TOKEN || actionsTok;

if (!repoFull || !actionsTok) {
  console.warn('setup-project-board: missing GITHUB_REPOSITORY or GITHUB_TOKEN – skipping.');
  process.exit(0);          // soft-skip, not a failure
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({
  auth: actionsTok,
  userAgent: 'setup-project-board-script',
  request: { mediaType: { previews: ['inertia'] } }   // Classic Projects preview header
});

async function ensureColumns(project_id) {
  const existing = await octokit.paginate(octokit.rest.projects.listColumns, { project_id });
  for (const name of ['Todo', 'In Progress', 'Done']) {
    if (existing.some(c => c.name === name)) continue;
    await octokit.rest.projects.createColumn({ project_id, name });
    console.log(`  ↳ created “${name}” column`);
  }
}

(async () => {
  try {
    const projects = await octokit.paginate(octokit.rest.projects.listForRepo, { owner, repo });
    let board = projects.find(p => p.name === boardName);

    if (!board) {
      board = (await octokit.rest.projects.createForRepo({
        owner, repo, name: boardName,
        body: 'Automated classic project board created by CI'
      })).data;
      console.log(`Created project board “${boardName}” (#${board.id})`);
    } else {
      console.log(`Project board “${boardName}” already exists (#${board.id})`);
    }
    await ensureColumns(board.id);
    console.log('Columns verified ✔');

  } catch (err) {
    /*───────────────────────────── graceful degradation ─────────────────────*/
    const code = err.status ?? err.code;
    if (code === 410 || code === 403) {
      console.warn(`setup-project-board: Classic Projects API refused the call (${code}).`);
      console.warn('👉  Action continued – board provisioning skipped.');
      console.warn('    • Enable “Projects (classic)” under repo Settings ▸ Features, OR');
      console.warn('    • Migrate this workflow to GitHub Projects v2 when ready.');
      process.exit(0);      // do *not* fail the job
    }
    /* For any other unexpected error we fail hard so CI surfaces it. */
    console.error(err);
    process.exit(1);
  }
})();
