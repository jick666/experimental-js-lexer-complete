#!/usr/bin/env node

const fs = require('fs');
const { Octokit } = require('@octokit/rest');
const token = process.env.GITHUB_TOKEN;
const repoFull = process.env.GITHUB_REPOSITORY;
const boardName = process.env.PROJECT_NAME || 'Experimental Lexer';

if (!token) {
  console.error('GITHUB_TOKEN env var required');
  process.exit(1);
}

if (!repoFull) {
  console.error('GITHUB_REPOSITORY env var required');
  process.exit(1);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

async function getTodoColumnId() {
  const { data: projects } = await octokit.request('GET /repos/{owner}/{repo}/projects', {
    owner,
    repo,
    mediaType: { previews: ['inertia'] }
  });
  const project = projects.find(p => p.name === boardName);
  if (!project) return null;
  const { data: columns } = await octokit.request('GET /projects/{project_id}/columns', {
    project_id: project.id,
    mediaType: { previews: ['inertia'] }
  });
  const column = columns.find(c => c.name === 'Todo');
  return column ? column.id : null;
}

async function getExistingTitles() {
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    per_page: 100,
  });
  return new Set(issues.map(i => i.title));
}

function parseTodos(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Checklist not found at ${filePath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return content
    .split('\n')
    .filter(line => line.startsWith('- [ ] '))
    .map(line => line.replace(/^- \[ \] /, '').trim().replace(/`/g, ''));
}

async function main() {
  const existing = await getExistingTitles();
  const todos = parseTodos('docs/TODO_CHECKLIST.md');
  const columnId = await getTodoColumnId();
  if (!columnId) {
    console.warn('Project board or Todo column not found');
  }

  for (const task of todos) {
    const title = `TODO: ${task}`;
    if (existing.has(title)) continue;

    try {
      const issue = await octokit.rest.issues.create({
        owner,
        repo,
        title,
        body: 'Auto-generated task from TODO_CHECKLIST.md',
        labels: ['todo'],
      });
      console.log(`Created issue: ${title} (#${issue.data.number})`);
      if (columnId) {
        await octokit.request('POST /projects/columns/{column_id}/cards', {
          column_id: columnId,
          content_id: issue.data.id,
          content_type: 'Issue',
          mediaType: { previews: ['inertia'] }
        });
      }
    } catch (err) {
      console.error(`Failed to create issue for "${task}":`, err);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
