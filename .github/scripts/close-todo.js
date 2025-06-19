#!/usr/bin/env node
import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';

const dryRun = process.argv.includes('--dry-run');
const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;
if (!token || !repoFull) {
  console.warn('ℹ️  close-todo: missing GitHub creds');
  process.exit(0);
}
const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

const logs = execSync('git log -n 20 --pretty=format:"%s"').toString();
const implemented = Array.from(logs.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)).map(m => m[1]);
if (implemented.length === 0) {
  console.log('ℹ️  close-todo: no implemented readers found');
  process.exit(0);
}
const issues = await octokit.paginate(octokit.rest.issues.listForRepo, { owner, repo, state: 'open', per_page: 100 });
for (const r of new Set(implemented)) {
  const title = `TODO: ${r}`;
  const issue = issues.find(i => i.title === title);
  if (issue) {
    if (dryRun) {
      console.log(`[dry-run] would close issue #${issue.number} (${title})`);
    } else {
      await octokit.rest.issues.update({ owner, repo, issue_number: issue.number, state: 'closed' });
      console.log(`Closed issue #${issue.number} (${title})`);
    }
  }
}
