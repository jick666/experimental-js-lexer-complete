#!/usr/bin/env node
/**
 * Close every open “TODO: <ReaderName>” issue once its reader
 * has actually been merged (detected via recent commit messages).
 *
 * ENV required:
 *   - GITHUB_TOKEN       Personal-access token / Actions token
 *   - GITHUB_REPOSITORY “owner/repo” (e.g. openai/experimental-js-lexer)
 */

import { execSync } from 'child_process';
import { Octokit }   from '@octokit/rest';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;
if (!token || !repoFull) {
  console.error('❌ GITHUB_TOKEN and GITHUB_REPOSITORY must be set');
  process.exit(1);
}
const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

/* 1️⃣ Collect all readers that landed in the last ~100 commits */
const logs = execSync('git log -n 100 --pretty=format:"%s"').toString();
const implemented = Array.from(
  logs.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)
).map(m => m[1]);
const unique = [...new Set(implemented)];
if (unique.length === 0) {
  console.log('ℹ️ No recently-landed readers found - nothing to close.');
  process.exit(0);
}

/* 2️⃣ Fetch all open issues once (pagination helper keeps it simple) */
const openIssues = await octokit.paginate(
  octokit.rest.issues.listForRepo,
  { owner, repo, state: 'open', per_page: 100 }
);

/* 3️⃣ Close matching TODO issues */
for (const reader of unique) {
  const title = `TODO: ${reader}`;
  const matches = openIssues.filter(i => i.title === title);
  for (const issue of matches) {
    await octokit.rest.issues.update({
      owner, repo, issue_number: issue.number, state: 'closed'
    });
    console.log(`✅ Closed #${issue.number} – ${title}`);
  }
}
