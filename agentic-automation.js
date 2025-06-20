#!/usr/bin/env node
import { execSync } from 'child_process';
import { Octokit }    from '@octokit/rest';
import { checkCoverage } from './src/utils/checkCoverage.js';
import { fileURLToPath } from 'url';

const dryRun = process.argv.includes('--dry-run');
const TASK_ID = process.env.TASK_ID || 'task';
const date    = new Date().toISOString().slice(0,10).replace(/-/g,'');
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
  run('npm run lint');
  run('npm test');
  checkCoverage(90);
}

async function openPr(octokitInst) {
  const repoFull = process.env.GITHUB_REPOSITORY;
  const token    = process.env.GITHUB_TOKEN;
  if (!repoFull || !token) {
    console.warn('⚠️  Missing GITHUB_TOKEN or GITHUB_REPOSITORY; skipping PR creation');
    return;
  }

  const [owner, repo] = repoFull.split('/');
  const octokit = octokitInst || new Octokit({ auth: token });
  const title   = execSync('git log -1 --pretty=%s').toString().trim();
  const body    = execSync('git log -1 --pretty=%B').toString().trim();

  // Check for an existing PR from this branch
  const { data: existing } = await octokit.rest.pulls.list({
    owner,
    repo,
    head: `${owner}:${branch}`,
    state: 'open',
  });

  let pr;
  if (existing.length > 0) {
    pr = await octokit.rest.pulls.update({
      owner,
      repo,
      pull_number: existing[0].number,
      title: `[agent] ${title}`,
      body,
    });
  } else {
    pr = await octokit.rest.pulls.create({
      owner,
      repo,
      head: branch,
      base: 'main',
      title: `[agent] ${title}`,
      body,
    });
  }

  try {
    await octokit.rest.issues.addLabels({
      owner,
      repo,
      issue_number: pr.data.number,
      labels: ['reader'],
    });
  } catch (err) {
    console.warn(`⚠️  Failed to label PR: ${err.message}`);
  }
}

export { openPr };

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
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
}
