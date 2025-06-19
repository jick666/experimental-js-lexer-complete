#!/usr/bin/env node
import { Octokit } from '@octokit/rest';
import { LABELS } from './constants.js';

function log(level, msg) {
  console.log(`[${new Date().toISOString()}] [${level}] ${msg}`);
}

const dryRun = process.argv.includes('--dry-run');
const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;

if (!token || !repoFull) {
  log('warn', 'close-todo: missing credentials – skipping.');
  process.exit(0);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner,
  repo,
  labels: LABELS.TODO,
  state: 'open',
  per_page: 100
});

for (const issue of issues) {
  if (dryRun) {
    log('info', `[dry-run] would close #${issue.number}`);
    continue;
  }
  try {
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issue.number,
      state: 'closed'
    });
    log('info', `Closed #${issue.number} – ${issue.title}`);
  } catch (err) {
    log('error', `Failed to close #${issue.number}: ${err.message}`);
    process.exitCode = 1;
  }
}

