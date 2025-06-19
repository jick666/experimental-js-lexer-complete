#!/usr/bin/env node
// agentic-automation.js
// Coordinates autonomous agents purely via GitHub and local tests –
// no direct OpenAI/Codex API calls are made.
import { execSync } from 'child_process';
import { Octokit }    from '@octokit/rest';

const dryRun = process.argv.includes('--dry-run');
// unique branch per task / day, ensures agents don't clash
const TASK_ID = process.env.TASK_ID || 'task';
const date    = new Date().toISOString().slice(0,10).replace(/-/g, '');
const branch  = `agent/${date}-${TASK_ID}`;

function run(cmd) {
  console.log(`$ ${cmd}`);
  if (!dryRun) execSync(cmd, { stdio: 'inherit' });
}

function tryRun(cmd) {
  try { run(cmd); return true; } catch {
    return false;
  }
}

function syncMain() {
  run('git fetch origin');
  run('git checkout main');
  run('git reset --hard origin/main');
}

function rebaseMain() {
  if (!tryRun('git pull --rebase origin main')) {
    run('git rebase --abort');
    console.log('Rebase conflict detected, resyncing');
    syncMain();
    run(`git checkout -B ${branch}`);
  }
}

function runChecks() {
  // ensure lint and tests (with coverage) pass before proceeding
  run('npm run lint');
  run('npm test -- --coverage');
}

async function openPr() {
  // uses the repo's GITHUB_TOKEN to open a PR via the GitHub REST API
  const repoFull = process.env.GITHUB_REPOSITORY;
  const token    = process.env.GITHUB_TOKEN;
  if (!repoFull || !token) {
    console.warn('⚠️  Missing GITHUB_TOKEN or GITHUB_REPOSITORY; skipping PR creation');
    return;
  }

  const [owner, repo] = repoFull.split('/');
  const octokit = new Octokit({ auth: token });
  const title   = execSync('git log -1 --pretty=%s').toString().trim();
  const body    = execSync('git log -1 --pretty=%B').toString().trim();

  await octokit.rest.pulls.create({
    owner,
    repo,
    head: branch,
    base: 'main',
    title: `[agent] ${title}`,
    body,
  });
}

(async () => {
  console.log(`agentic automation start${dryRun ? ' (dry-run)' : ''}`);
  syncMain();
  run(`git checkout -B ${branch}`);
  rebaseMain();
  // ← your code edits happen here
  runChecks();
  rebaseMain();
  runChecks();
  run('git push --set-upstream origin HEAD');
  await openPr();
  console.log('automation finished');
})();
