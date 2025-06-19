#!/usr/bin/env node
import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;
if (!token || !repoFull) {
  console.warn('ℹ️  close-todo: no GitHub creds – skipping.');
  process.exit(0);
}
const [owner, repo] = repoFull.split('/');

const logs = execSync('git log -n 20 --pretty=format:%s').toString();
const implemented = Array.from(logs.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)).map(m => m[1]);
if (implemented.length === 0) {
  console.log('ℹ️  close-todo: no reader commits found.');
  process.exit(0);
}

const octokit = new Octokit({ auth: token });
const { data: issues } = await octokit.rest.issues.listForRepo({ owner, repo, state: 'open', per_page: 100, labels: 'reader' });
for (const r of new Set(implemented)) {
  const title = `[Reader] ${r}`;
  const match = issues.find(i => i.title === title);
  if (!match) continue;
  if (process.argv.includes('--dry-run')) {
    console.log(`🔎 Would close issue #${match.number}: ${title}`);
  } else {
    await octokit.rest.issues.update({ owner, repo, issue_number: match.number, state: 'closed' });
    console.log(`✅ Closed issue #${match.number}: ${title}`);
  }
}
