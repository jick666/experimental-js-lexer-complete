#!/usr/bin/env node
/**
 * Detect readers mentioned in docs/LEXER_SPEC.md that do not yet appear
 * in src/lexer/LexerEngine.js.  One GitHub issue is opened per missing reader.
 *
 * Requires:
 *   GITHUB_TOKEN      – PAT or Actions token
 *   GITHUB_REPOSITORY – "owner/repo"
 *   PROJECT_NAME      – (optional) classic board name to drop cards into
 */

import fs from "fs";
import { Octokit } from "@octokit/rest";

const {
  GITHUB_TOKEN: token,
  GITHUB_REPOSITORY: repoFull,
  PROJECT_NAME: boardName
} = process.env;

const dryRun = process.argv.includes('--dry-run');

if (!token || !repoFull) {
  console.warn("ℹ️  check-drift: no GitHub creds – skipping.");
  process.exit(0);
}

const [owner, repo] = repoFull.split("/");
const octokit = new Octokit({ auth: token });

/* 1️⃣  spec vs implementation ------------------------------------------- */
const spec   = fs.readFileSync("docs/LEXER_SPEC.md", "utf8");
const engine = fs.readFileSync("src/lexer/LexerEngine.js", "utf8");

const specReaders = [...spec.matchAll(/§\d+\.\d+\s+([A-Za-z]+Reader)/g)].map(m => m[1]);
const implReaders = [...engine.matchAll(/\b([A-Za-z]+Reader)\b/g)].map(m => m[1]);
const missing     = specReaders.filter(r => !implReaders.includes(r));

if (missing.length === 0) {
  console.log("✅ No drift detected – all spec readers implemented.");
  process.exit(0);
}

/* 2️⃣  existing issues cache -------------------------------------------- */
const existing = new Set(
  (await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner, repo, state: "open", per_page: 100
  })).map(i => i.title)
);

/* helper – optionally add a card to the board's “Todo” column ----------- */
async function addCard(issueId) {
  if (!boardName) return;
  try {
    const proj = (await octokit.request(
      "GET /repos/{owner}/{repo}/projects",
      { owner, repo, mediaType: { previews: ["inertia"] } }
    )).data.find(p => p.name === boardName);
    if (!proj) return;

    const todoCol = (await octokit.request(
      "GET /projects/{project_id}/columns",
      { project_id: proj.id, mediaType: { previews: ["inertia"] } }
    )).data.find(c => c.name === "Todo");
    if (!todoCol) return;

    await octokit.request("POST /projects/columns/{column_id}/cards", {
      column_id: todoCol.id,
      content_id: issueId,
      content_type: "Issue",
      mediaType: { previews: ["inertia"] }
    });
  } catch {/* non-fatal */}
}

/* 3️⃣  open issues for every missing reader ----------------------------- */
for (const r of missing) {
  const title = `[Reader] ${r}`;
  if (existing.has(title)) {
    console.log(`ℹ️  Issue already exists: ${title}`);
    continue;
  }
  if (dryRun) {
    console.log(`🔎 Would create: ${title}`);
  } else {
    const issue = await octokit.rest.issues.create({
      owner, repo, title,
      body: `Spec includes **${r}** but it is not yet implemented in the lexer.`,
      labels: ["reader", "auto-generated"]
    });
    console.log(`🆕 Created #${issue.data.number} – ${title}`);
    await addCard(issue.data.id);
  }
}
