#!/usr/bin/env node
/**
 * Create GitHub issues for unchecked tasks in docs/TODO_CHECKLIST.md
 * and (optionally) put them into the board’s “Todo” column.
 */
import fs from "fs";
import { Octokit } from "@octokit/rest";

const {
  GITHUB_TOKEN,
  GITHUB_REPOSITORY,
  PROJECT_NAME = "Experimental Lexer"
} = process.env;

const dryRun = !GITHUB_TOKEN || !GITHUB_REPOSITORY;
if (dryRun) console.log("ℹ️  seed-todo: dry-run (no GitHub creds)");

const tasks = fs.readFileSync("docs/TODO_CHECKLIST.md", "utf8")
  .split("\n")
  .filter(l => l.startsWith("- [ ] "))
  .map(l => l.replace(/^- \[ \] /, "").trim().replace(/`/g, ""));

if (dryRun) {
  tasks.forEach(t => console.log(`✓ would create: TODO: ${t}`));
  process.exit(0);
}

/* live mode ------------------------------------------------------------- */
const [owner, repo] = GITHUB_REPOSITORY.split("/");
const octokit = new Octokit({ auth: GITHUB_TOKEN });

const existing = new Set(
  (await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner, repo, state: "open", per_page: 100
  })).map(i => i.title)
);

/* locate board + Todo column (generic request keeps us future-proof) ---- */
let todoColumnId = null;
try {
  const proj = (await octokit.request(
    "GET /repos/{owner}/{repo}/projects",
    { owner, repo, mediaType: { previews: ["inertia"] } }
  )).data.find(p => p.name === PROJECT_NAME);

  if (proj) {
    todoColumnId = (await octokit.request(
      "GET /projects/{project_id}/columns",
      { project_id: proj.id, mediaType: { previews: ["inertia"] } }
    )).data.find(c => c.name === "Todo")?.id;
  }
} catch {/* missing classic projects is fine */}

/* create missing issues ------------------------------------------------- */
for (const task of tasks) {
  const title = `TODO: ${task}`;
  if (existing.has(title)) continue;

  const issue = await octokit.rest.issues.create({
    owner, repo, title,
    body: "Auto-generated from docs/TODO_CHECKLIST.md",
    labels: ["todo"]
  });
  console.log(`✓ created #${issue.data.number}: ${title}`);

  if (todoColumnId) {
    await octokit.request("POST /projects/columns/{column_id}/cards", {
      column_id: todoColumnId,
      content_id: issue.data.id,
      content_type: "Issue",
      mediaType: { previews: ["inertia"] }
    });
  }
}
