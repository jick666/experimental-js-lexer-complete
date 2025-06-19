#!/usr/bin/env node
import { Octokit } from '@octokit/rest';

const dryRun = process.argv.includes('--dry-run');
const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;

if (!token || !repoFull) {
  console.warn('ℹ️  close-todo: missing credentials – skipping.');
  process.exit(0);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner,
  repo,
  labels: 'todo',
  state: 'open',
  per_page: 100
});

for (const issue of issues) {
  if (dryRun) {
    console.log(`[dry-run] would close #${issue.number}`);
    continue;
  }
  await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issue.number,
    state: 'closed'
  });
  console.log(`Closed #${issue.number} – ${issue.title}`);
}
