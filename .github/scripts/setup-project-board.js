#!/usr/bin/env node
/**
 * Create or verify a “Todo / In Progress / Done” project board.
 *
 * ▸ Uses Classic Projects REST URLs via `octokit.request()` instead of the
 *   now-removed `rest.projects.*` helpers, so it works on Octokit v19 → v22.
 * ▸ Uses only the default GITHUB_TOKEN (Actions installation token) for the
 *   actual board calls; your fine-grained PAT is not involved.
 * ▸ Skips cleanly if Classic Projects are disabled (HTTP 410) or the token
 *   lacks `projects:write` (HTTP 403).  Nothing else in CI fails.
 */

import process from 'node:process';
import { Octokit } from '@octokit/rest';

const repoFull   = process.env.GITHUB_REPOSITORY;
const boardName  = process.env.PROJECT_NAME || 'Automation';
const token      = process.env.GITHUB_TOKEN;               // Actions token only

if (!repoFull || !token) {
  console.warn('setup-project-board: missing GITHUB_REPOSITORY or GITHUB_TOKEN – skipping.');
  process.exit(0);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({
  auth: token,
  userAgent: 'setup-project-board-script',
  request: { mediaType: { previews: ['inertia'] } } // Classic Projects header
});

/* low-level helpers that work regardless of Octokit release -------------- */
const gh = {
  listProjects:   () => octokit.request('GET /repos/{owner}/{repo}/projects',   { owner, repo }),
  createProject:  () => octokit.request('POST /repos/{owner}/{repo}/projects',  {
                      owner, repo, name: boardName,
                      body: 'Automated classic project board created by CI'
                    }),
  listColumns:    (project_id) => octokit.request('GET /projects/{project_id}/columns',
                      { project_id }),
  createColumn:   (project_id, name) => octokit.request('POST /projects/{project_id}/columns',
                      { project_id, name })
};

async function ensureColumns(project_id) {
  const { data: cols } = await gh.listColumns(project_id);
  for (const name of ['Todo', 'In Progress', 'Done']) {
    if (cols.some(c => c.name === name)) continue;
    await gh.createColumn(project_id, name);
    console.log(`  ↳ created “${name}” column`);
  }
}

(async () => {
  try {
    let { data: boards } = await gh.listProjects();
    let board = boards.find(p => p.name === boardName);

    if (!board) {
      ({ data: board } = await gh.createProject());
      console.log(`Created project board “${boardName}” (#${board.id})`);
    } else {
      console.log(`Project board “${boardName}” already exists (#${board.id})`);
    }

    await ensureColumns(board.id);
    console.log('Columns verified ✔');

  } catch (err) {
    const code = err.status ?? err.code;
    if (code === 410 || code === 403) {
      console.warn(`setup-project-board: Classic Projects API refused (${code}).`);
      console.warn('👉  Skipping board provisioning.');
      console.warn('    • Enable “Projects (classic)” in repo Settings, OR');
      console.warn('    • Replace this script with a Projects v2 GraphQL version.');
      process.exit(0);
    }
    console.error(err);
    process.exit(1);
  }
})();
