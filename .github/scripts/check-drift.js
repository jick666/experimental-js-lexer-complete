#!/usr/bin/env node
/**
 * check-drift.js
 *
 * Compares the list of *Reader* names referenced in docs/LEXER_SPEC.md
 * against those wired into src/lexer/LexerEngine.js.  For every missing
 * reader it opens a “[Reader] <Name>” issue (and optionally drops a card
 * in the project-board “Todo” column).
 *
 * ── Environment ───────────────────────────────────────────────────────────────
 *   GITHUB_TOKEN      Personal-access token or Actions token (issues:write)
 *   GITHUB_REPOSITORY owner/repo   (e.g.  octocat/hello-world)
 *   PROJECT_NAME      (opt) Classic project-board name – if set we add a card
 *
 * If the credentials are *not* present the script prints a note and exits
 * **successfully** so that local runs & Codex containers stay green.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'fs';
import { Octokit } from '@octokit/rest';

const {
  GITHUB_TOKEN: token,
  GITHUB_REPOSITORY: repoFull,
  PROJECT_NAME: boardName
} = process.env;

/* ── 0 · offline / dry-run guard ─────────────────────────────────────────── */
if (!token || !repoFull) {
  console.warn('🔎 check-drift.js: GitHub credentials not present – skipping');
  process.exit(0); // soft-exit: do *not* fail CI or Codex tasks
}

/* ── 1 · parse spec vs implementation ───────────────────────────────────── */
const spec   = fs.readFileSync('docs/LEXER_SPEC.md',       'utf8');
const engine = fs.readFileSync('src/lexer/LexerEngine.js', 'utf8');

const specReaders = Array.from(
  spec.matchAll(/§\d+\.\d+\s+([A-Za-z]+Reader)/g)
).map(m => m[1]);

const implReaders = Array.from(
  engine.matchAll(/\b([A-Za-z]+Reader)\b/g)
).map(m => m[1]);

const missing = specReaders.filter(r => !implReaders.includes(r));

if (missing.length === 0) {
  console.log('✅ No drift detected – all spec readers implemented.');
  process.exit(0);
}

/* ── 2 · GitHub plumbing ─────────────────────────────────────────────────── */
const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

/* cache current open-issue titles to avoid duplicates */
const existingTitles = new Set(
  (await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    per_page: 100
  })).map(i => i.title)
);

/* helper to drop a card in the board’s Todo column (if configured) */
async function addCard(issueId) {
  if (!boardName) return;

  try {
    const projects = await octokit.request(
      'GET /repos/{owner}/{repo}/projects',
      { owner, repo, mediaType: { previews: ['inertia'] } }
    );
    const board = projects.data.find(p => p.name === boardName);
    if (!board) return;

    const cols = await octokit.request(
      'GET /projects/{project_id}/columns',
      { project_id: board.id, mediaType: { previews: ['inertia'] } }
    );
    const todo = cols.data.find(c => c.name === 'Todo');
    if (!todo) return;

    await octokit.request('POST /projects/columns/{column_id}/cards', {
      column_id: todo.id,
      content_id: issueId,
      content_type: 'Issue',
      mediaType: { previews: ['inertia'] }
    });
  } catch {
    /* non-fatal – board or permissions may be absent */
  }
}

/* ── 3 · create one issue per missing reader ─────────────────────────────── */
for (const reader of missing) {
  const title = `[Reader] ${reader}`;
  if (existingTitles.has(title)) {
    console.log(`ℹ️  Issue already exists: ${title}`);
    continue;
  }

  const issue = await octokit.rest.issues.create({
    owner,
    repo,
    title,
    body: `The spec references **${reader}** but it is not yet implemented in the lexer.`,
    labels: ['reader', 'auto-generated']
  });

  console.log(`🆕 Created #${issue.data.number} – ${title}`);
  await addCard(issue.data.id);
}

console.log('🎉 check-drift.js finished – drift issues filed as needed.');
