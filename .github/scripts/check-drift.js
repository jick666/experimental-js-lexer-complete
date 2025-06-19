#!/usr/bin/env node
/**
 * Detect readers that are mentioned in the spec but not wired up
 * in `src/lexer/LexerEngine.js`.  One issue per missing reader is opened.
 *
 * ENV required:
 *   - GITHUB_TOKEN       Personal-access token / Actions token
 *   - GITHUB_REPOSITORY “owner/repo”
 *   - PROJECT_NAME      (optional) Classic project-board name – if present
 *                        a card is dropped into the “Todo” column.
 */

import fs           from 'fs';
import { Octokit }  from '@octokit/rest';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull, PROJECT_NAME: boardName } = process.env;
if (!token || !repoFull) {
  console.error('❌ GITHUB_TOKEN and GITHUB_REPOSITORY must be set');
  process.exit(1);
}
const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

/* 1️⃣ Spec vs implementation */
const spec     = fs.readFileSync('docs/LEXER_SPEC.md',      'utf8');
const engine   = fs.readFileSync('src/lexer/LexerEngine.js', 'utf8');
const specReaders  = Array.from(spec   .matchAll(/§\d+\.\d+\s+([A-Za-z]+Reader)/g))
                          .map(m => m[1]);
const implReaders  = Array.from(engine.matchAll(/\b([A-Za-z]+Reader)\b/g))
                          .map(m => m[1]);
const missing = specReaders.filter(r => !implReaders.includes(r));

if (missing.length === 0) {
  console.log('✅ No drift detected – all spec readers implemented.');
  process.exit(0);
}

/* 2️⃣ Cache open-issue titles to avoid dupes */
const existing = new Set(
  (await octokit.paginate(octokit.rest.issues.listForRepo,
    { owner, repo, state: 'open', per_page: 100 }
  )).map(i => i.title)
);

/* Helper to optionally add a card to the project-board “Todo” column */
async function addCard(issueId) {
  if (!boardName) return;
  try {
    // locate classic project
    const projects = await octokit.request('GET /repos/{owner}/{repo}/projects',
      { owner, repo, mediaType: { previews: ['inertia'] } });
    const project = projects.data.find(p => p.name === boardName);
    if (!project) return;

    // find / create “Todo” column
    const cols = await octokit.request('GET /projects/{project_id}/columns',
      { project_id: project.id, mediaType: { previews: ['inertia'] } });
    let todo = cols.data.find(c => c.name === 'Todo');
    if (!todo) return;

    await octokit.request('POST /projects/columns/{column_id}/cards', {
      column_id: todo.id,
      content_id: issueId,
      content_type: 'Issue',
      mediaType: { previews: ['inertia'] }
    });
  } catch { /* non-fatal – board might not exist for forks */ }
}

/* 3️⃣ Open one issue per missing reader */
for (const r of missing) {
  const title = `[Reader] ${r}`;
  if (existing.has(title)) {
    console.log(`ℹ️ Issue already exists: ${title}`);
    continue;
  }
  const issue = await octokit.rest.issues.create({
    owner, repo,
    title,
    body: `Spec includes **${r}** but it is not yet implemented in the lexer.`,
    labels: ['reader', 'auto-generated']
  });
  console.log(`🆕 Created #${issue.data.number} – ${title}`);
  await addCard(issue.data.id);
}
