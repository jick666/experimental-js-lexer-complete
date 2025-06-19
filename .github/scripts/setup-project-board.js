#!/usr/bin/env node
/**
 * Guarantee a classic project board called $PROJECT_NAME exists with the
 * columns ["Todo", "In Progress", "Review", "Done"].
 */
import { Octokit } from "@octokit/rest";

const {
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  PROJECT_NAME = "Experimental Lexer"
} = process.env;

if (!GITHUB_TOKEN || !GITHUB_REPOSITORY) {
  console.log("ℹ️  setup-project-board: no GitHub creds – skipping.");
  process.exit(0);
}

const [owner, repo] = GITHUB_REPOSITORY.split("/");
const octokit = new Octokit({ auth: GITHUB_TOKEN });
const wantCols = ["Todo", "In Progress", "Review", "Done"];

/* convenience wrapper that always speaks classic-projects API ---------- */
const gh = (path, params = {}) =>
  octokit.request(path, {
    owner, repo,
    mediaType: { previews: ["inertia"] },
    ...params
  });

(async () => {
  /* 1 – board */
  const boards = (await gh("GET /repos/{owner}/{repo}/projects")).data;
  let board = boards.find(b => b.name === PROJECT_NAME);
  if (!board) {
    board = (await gh("POST /repos/{owner}/{repo}/projects", { name: PROJECT_NAME })).data;
    console.log(`✅ created board “${PROJECT_NAME}”`);
  }

  /* 2 – columns */
  const existing = new Set(
    (await gh("GET /projects/{project_id}/columns", { project_id: board.id }))
      .data.map(c => c.name)
  );

  for (const name of wantCols) {
    if (!existing.has(name)) {
      await gh("POST /projects/{project_id}/columns", {
        project_id: board.id, name
      });
      console.log(`  • added column ${name}`);
    }
  }
})();
