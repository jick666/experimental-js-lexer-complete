#!/usr/bin/env node
/**
 * Creates GitHub issues for each unchecked item in docs/TODO_CHECKLIST.md
 * and drops them in the “Todo” column of the configured project board.
 *
 * Safe to run locally – will simply print the would-be actions when
 * GITHUB_TOKEN / GITHUB_REPOSITORY are absent.
 */
import fs from 'fs';
import { Octokit } from '@octokit/rest';

const { GITHUB_TOKEN, GITHUB_REPOSITORY, PROJECT_NAME = 'Experimental Lexer' } =
  process.env;

const dryRun = !GITHUB_TOKEN || !GITHUB_REPOSITORY;
if (dryRun) {
  console.log('ℹ️  No GitHub credentials – running in dry-run mode.');
}

const checklist = fs.readFileSync('docs/TODO_CHECKLIST.md', 'utf8');
const tasks = checklist
  .split('\n')
  .filter(l => l.startsWith('- [ ] '))
  .map(l => l.replace(/^- \[ \] /, '').trim().replace(/`/g, ''));

if (dryRun) {
  tasks.forEach(t => console.log(`✓ would create issue: TODO: ${t}`));
  process.exit(0);
}

/* live mode -------------------------------------------------------------- */
const [owner, repo] = GITHUB_REPOSITORY.split('/');
const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function run() {
  // 1) collect existing issue titles
  const existing = new Set(
    (await octokit.paginate(octokit.rest.issues.listForRepo, {
      owner,
      repo,
      state: 'open',
      per_page: 100
    })).map(i => i.title)
  );

  // 2) find the “Todo” column id (optional)
  let todoColumnId = null;
  try {
    const project = (
      await octokit.rest.projects.listForRepo({
        owner,
        repo,
        mediaType: { previews: ['inertia'] }
      })
    ).data.find(p => p.name === PROJECT_NAME);
    if (project) {
      todoColumnId = (
        await octokit.rest.projects.listColumns({
          project_id: project.id,
          mediaType: { previews: ['inertia'] }
        })
      ).data.find(c => c.name === 'Todo')?.id;
    }
  } catch { /* ignore missing project */ }

  // 3) create missing issues
  for (const task of tasks) {
    const title = `TODO: ${task}`;
    if (existing.has(title)) continue;

    const issue = await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body: 'Auto-generated from docs/TODO_CHECKLIST.md',
      labels: ['todo']
    });
    console.log(`✓ created #${issue.data.number}: ${title}`);

    if (todoColumnId) {
      await octokit.rest.projects.createCard({
        column_id: todoColumnId,
        content_id: issue.data.id,
        content_type: 'Issue',
        mediaType: { previews: ['inertia'] }
      });
    }
  }
}

run().catch(err => {
  console.error('❌  seed-todo failed:', err.message);
  process.exit(1);
});
