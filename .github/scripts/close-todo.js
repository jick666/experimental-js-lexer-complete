#!/usr/bin/env node
/**
 * close-todo.js
 *
 * Closes any open “TODO: <ReaderName>” issues once a corresponding
 * `feat(reader): <ReaderName>` commit has landed on the main branch.
 *
 * ── Environment ────────────────────────────────────────────────────────────────
 *   GITHUB_TOKEN      Personal-access token or Actions token with “issues:write”
 *   GITHUB_REPOSITORY owner/repo  (e.g.  octocat/hello-world)
 *
 * If either variable is missing the script exits **successfully** so local
 * runs or CI jobs without credentials do not fail the build.
 * ───────────────────────────────────────────────────────────────────────────────
 */

import { execSync } from 'child_process';
import { Octokit }   from '@octokit/rest';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;

/* ── 0 · credentials check ──────────────────────────────────────────────── */
if (!token || !repoFull) {
  console.warn('🔎 close-todo.js: GitHub credentials not present – skipping');
  process.exit(0);                       // ← soft-exit keeps CI green
}

/* ── 1 · collect landed readers from recent commit messages ─────────────── */
const commitLog = execSync('git log -n 100 --pretty=format:"%s"').toString();
const mergedReaders = [
  ...commitLog.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)
].map(m => m[1]);

const uniqueReaders = [...new Set(mergedReaders)];
if (uniqueReaders.length === 0) {
  console.log('ℹ️  close-todo.js: no recently-merged readers detected');
  process.exit(0);
}

/* ── 2 · fetch open issues once ─────────────────────────────────────────── */
const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

const openIssues = await octokit.paginate(
  octokit.rest.issues.listForRepo,
  { owner, repo, state: 'open', per_page: 100 }
);

/* ── 3 · close the matching TODO issues ─────────────────────────────────── */
for (const reader of uniqueReaders) {
  const expectedTitle = `TODO: ${reader}`;
  const matches = openIssues.filter(i => i.title === expectedTitle);

  for (const issue of matches) {
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issue.number,
      state: 'closed'
    });
    console.log(`✅ Closed #${issue.number} – ${expectedTitle}`);
  }
}

console.log('🎉 close-todo.js finished – nothing else to do');
