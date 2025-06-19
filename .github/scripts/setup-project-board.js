#!/usr/bin/env node
import { Octokit } from '@octokit/rest';

const token = process.env.GITHUB_TOKEN;
const repoFull = process.env.GITHUB_REPOSITORY;
const boardName = process.env.PROJECT_NAME || 'Experimental Lexer';
const columns = ['Todo', 'In Progress', 'Review', 'Done'];

if (!token || !repoFull) {
  console.error('GITHUB_TOKEN and GITHUB_REPOSITORY env vars required');
  process.exit(1);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

async function ensureBoard() {
  const { data: projects } = await octokit.request('GET /repos/{owner}/{repo}/projects', {
    owner,
    repo,
    mediaType: { previews: ['inertia'] }
  });
  let project = projects.find(p => p.name === boardName);
  if (!project) {
    project = (await octokit.request('POST /repos/{owner}/{repo}/projects', {
      owner,
      repo,
      name: boardName,
      mediaType: { previews: ['inertia'] }
    })).data;
    console.log(`Created board: ${boardName}`);
  } else {
    console.log(`Board exists: ${boardName}`);
  }

  const { data: existingCols } = await octokit.request('GET /projects/{project_id}/columns', {
    project_id: project.id,
    mediaType: { previews: ['inertia'] }
  });
  const names = existingCols.map(c => c.name);
  for (const name of columns) {
    if (!names.includes(name)) {
      await octokit.request('POST /projects/{project_id}/columns', {
        project_id: project.id,
        name,
        mediaType: { previews: ['inertia'] }
      });
      console.log(`Added column ${name}`);
    }
  }
}

ensureBoard().catch(err => {
  console.error(err);
  process.exit(1);
});
