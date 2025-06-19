#!/usr/bin/env node
/**
 * Close any open “TODO: <ReaderName>” issues once a matching
 * `feat(reader): <ReaderName>` commit lands.
 */

import { execSync } from "child_process";
import { Octokit }  from "@octokit/rest";

const { GITHUB_TOKEN: token, GITHUB_REPOSITORY: repoFull } = process.env;

if (!token || !repoFull) {
  console.log("ℹ️  close-todo: no GitHub creds – skipping.");
  process.exit(0);
}

const [owner, repo] = repoFull.split("/");
const octokit = new Octokit({ auth: token });

/* 1️⃣  extract recently-merged readers ---------------------------------- */
const log = execSync("git log -n 100 --pretty=format:%s").toString();
const readers = [...log.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)]
  .map(m => m[1]);
const unique = [...new Set(readers)];
if (unique.length === 0) {
  console.log("ℹ️  close-todo: nothing to close.");
  process.exit(0);
}

/* 2️⃣  close matching issues -------------------------------------------- */
const open = await octokit.paginate(octokit.rest.issues.listForRepo, {
  owner, repo, state: "open", per_page: 100
});

for (const r of unique) {
  const title = `TODO: ${r}`;
  for (const issue of open.filter(i => i.title === title)) {
    await octokit.rest.issues.update({
      owner, repo, issue_number: issue.number, state: "closed"
    });
    console.log(`✅ Closed #${issue.number} – ${title}`);
  }
}
