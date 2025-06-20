#!/usr/bin/env node
/**
 * Ensure a classic GitHub project board exists with Todo/In Progress/Done columns.
 * Requires:
 *   GITHUB_TOKEN      – PAT or Actions token
 *   GITHUB_REPOSITORY – "owner/repo"
 *   PROJECT_NAME      – board name (defaults to "Automation")
 */
import { Octokit } from '@octokit/rest';

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull, PROJECT_NAME } = process.env;
if (!token || !repoFull) {
  console.log('setup-project-board: missing credentials – skipping.');
  process.exit(0);
}

const boardName = PROJECT_NAME || 'Automation';
const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

async function ensureColumns(projectId) {
  const { data: columns } = await octokit.request('GET /projects/{project_id}/columns', {
    project_id: projectId,
    mediaType: { previews: ['inertia'] }
  });
  const needed = ['Todo', 'In Progress', 'Done'];
  for (const name of needed) {
    if (columns.some(c => c.name === name)) continue;
    await octokit.request('POST /projects/{project_id}/columns', {
      project_id: projectId,
      name,
      mediaType: { previews: ['inertia'] }
    });
  }
}

(async () => {
  let project = (await octokit.request('GET /repos/{owner}/{repo}/projects', {
    owner,
    repo,
    mediaType: { previews: ['inertia'] }
  })).data.find(p => p.name === boardName);

  if (!project) {
    project = (await octokit.request('POST /repos/{owner}/{repo}/projects', {
      owner,
      repo,
      name: boardName,
      body: 'Automated project board for issue triage.',
      mediaType: { previews: ['inertia'] }
    })).data;
    console.log(`Created project board '${boardName}'`);
  } else {
    console.log(`Project board '${boardName}' already exists`);
  }
  await ensureColumns(project.id);
})();
