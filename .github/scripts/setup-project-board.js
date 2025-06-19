#!/usr/bin/env node
/**
 * Ensures a project board named $PROJECT_NAME exists with the standard four
 * columns.  Silently exits offline.
 */
import { Octokit } from '@octokit/rest';

const { GITHUB_TOKEN, GITHUB_REPOSITORY, PROJECT_NAME = 'Experimental Lexer' } =
  process.env;

if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
  console.log('ℹ️  No GitHub credentials – skipped project-board setup.');
  process.exit(0);
}

const [owner, repo] = GITHUB_REPOSITORY.split('/');
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const columns = ['Todo', 'In Progress', 'Review', 'Done'];

(async () => {
  /* 1 – board */
  const boards = await octokit.rest.projects.listForRepo({
    owner,
    repo,
    mediaType: { previews: ['inertia'] }
  });
  let board = boards.data.find(p => p.name === PROJECT_NAME);
  if (!board) {
    board = (
      await octokit.rest.projects.createForRepo({
        owner,
        repo,
        name: PROJECT_NAME,
        mediaType: { previews: ['inertia'] }
      })
    ).data;
    console.log(`✓ created board ${PROJECT_NAME}`);
  }

  /* 2 – columns */
  const existing = (
    await octokit.rest.projects.listColumns({
      project_id: board.id,
      mediaType: { previews: ['inertia'] }
    })
  ).data.map(c => c.name);

  for (const col of columns) {
    if (!existing.includes(col)) {
      await octokit.rest.projects.createColumn({
        project_id: board.id,
        name: col,
        mediaType: { previews: ['inertia'] }
      });
      console.log(`  • added column ${col}`);
    }
  }
})();
