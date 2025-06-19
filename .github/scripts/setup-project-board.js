#!/usr/bin/env node
/**
 * setup-project-board.js
 *
 * Guarantee (if possible) a classic project board called $PROJECT_NAME with the
 * columns ["Todo", "In Progress", "Review", "Done"].
 *
 * If the Classic Projects API has been sunset (HTTP 410), the script logs a
 * warning and exits 0 so CI stays green.
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

/** always talk to the classic-projects preview */
const gh = (method, params = {}) =>
  octokit.request(method, {
    owner,
    repo,
    mediaType: { previews: ["inertia"] },
    ...params
  });

(async () => {
  try {
    /* 1 – locate or create board ---------------------------------------- */
    const boards = (await gh("GET /repos/{owner}/{repo}/projects")).data;
    let board = boards.find(b => b.name === PROJECT_NAME);

    if (!board) {
      board = (
        await gh("POST /repos/{owner}/{repo}/projects", { name: PROJECT_NAME })
      ).data;
      console.log(`✅ created board “${PROJECT_NAME}”`);
    }

    /* 2 – ensure required columns --------------------------------------- */
    const existing = new Set(
      (await gh("GET /projects/{project_id}/columns", {
        project_id: board.id
      })).data.map(c => c.name)
    );

    for (const col of wantCols) {
      if (!existing.has(col)) {
        await gh("POST /projects/{project_id}/columns", {
          project_id: board.id,
          name: col
        });
        console.log(`  • added column ${col}`);
      }
    }
  } catch (err) {
    const msg = String(err.message || "");
    if (err.status === 410 || msg.includes("Projects (classic) has been deprecated")) {
      console.warn(
        "⚠️  Classic project boards are no longer available on this repo. " +
        "Skipping board setup completely."
      );
      process.exit(0); // ✔️ keep CI green
    }
    console.error("❌ setup-project-board failed:", msg);
    process.exit(1);
  }
})();
