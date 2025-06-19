// .github/scripts/post-context.js

!/usr/bin/env node
/**
 * post-context.js
 *
 * Looks at files changed in a PR:
 *   • If it touches a *Reader* or *Plugin*, finds the matching § in docs/LEXER_SPEC.md
 *   • Echoes an ultra-compact summary as a PR comment so Codex agents see the rules
 *
 * Requires:
 *   GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER   (injected by the GH Action)
 */
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import { execSync } from 'child_process';

const {
  GITHUB_TOKEN: token,
  GITHUB_REPOSITORY: repoFull,
  PR_NUMBER: pr
} = process.env;

if (!token || !repoFull || !pr) {
  console.error('post-context: missing env');
  process.exit(1);
}

const [owner, repo] = repoFull.split('/');
const octokit = new Octokit({ auth: token });

/* ─── 1. changed files ───────────────────────────────────────────────────── */
const diff = execSync('git diff --name-only origin/main...HEAD').toString().trim().split('\n');
const interesting = diff.filter(f => /Reader\.js|Plugin\.js/.test(f));

if (!interesting.length) {
  console.log('post-context: nothing interesting, skipping comment');
  process.exit(0);
}

/* ─── 2. build context snippet ───────────────────────────────────────────── */
const spec = fs.readFileSync('docs/LEXER_SPEC.md', 'utf8');
const blocks = [];

for (const file of interesting) {
  const key = file.match(/([^/]+)\.js$/)?.[1];      // e.g. HexReader
  if (!key) continue;
  // find “§… <key without .js>” in the spec
  const regex = new RegExp(`§[\\d.]+\\s+${key.replace(/Reader$/, '')}`, 'i');
  const line = spec.split('\n').find(l => regex.test(l));
  if (line) blocks.push(`* **${key}** → ${line.trim()}`);
}

if (!blocks.length) process.exit(0);

/* ─── 3. comment once per PR ─────────────────────────────────────────────── */
const body =
`### 🤖 Auto-context

The PR touches the following components:

${blocks.join('\n')}

Please verify that implementation & tests follow the quoted spec sections.`;

await octokit.rest.issues.createComment({ owner, repo, issue_number: pr, body });
console.log('context comment posted');
