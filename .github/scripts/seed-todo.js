import fs from 'node:fs/promises';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const token = process.env.GITHUB_TOKEN;
const repoEnv = process.env.GITHUB_REPOSITORY;
const dryRun = process.env.DRY_RUN === 'true';

if (!dryRun && !token) {
  console.error('Missing GITHUB_TOKEN');
  process.exit(1);
}
if (!dryRun && !repoEnv) {
  console.error('Missing GITHUB_REPOSITORY');
  process.exit(1);
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const [owner, repo] = repoEnv ? repoEnv.split('/') : ['', ''];

async function loadTasks() {
  const checklistPath = path.resolve(__dirname, '../../docs/TODO_CHECKLIST.md');
  const file = await fs.readFile(checklistPath, 'utf8');
  const lines = file.split(/\r?\n/);
  let currentSection = '';
  const tasks = [];
  for (const line of lines) {
    const sectionMatch = line.match(/^###\s*(?:\d+\.\s*)?(.*)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      continue;
    }
    const taskMatch = line.match(/^- \[ \] (.+)/);
    if (taskMatch) {
      const title = currentSection
        ? `${currentSection}: ${taskMatch[1].trim()}`
        : taskMatch[1].trim();
      tasks.push(title);
    }
  }
  return tasks;
}

function apiRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function issueExists(title) {
  if (dryRun) return false;
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/issues?per_page=100&state=all`,
    method: 'GET',
    headers: {
      'User-Agent': 'todo-seed-script',
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  const { status, body } = await apiRequest(options);
  if (status >= 200 && status < 300) {
    const issues = JSON.parse(body);
    return issues.some(issue => issue.title === title);
  }
  return false;
}

async function createIssue(title) {
  if (dryRun) {
    console.log(`[dry-run] create issue: ${title}`);
    return;
  }
  if (await issueExists(title)) {
    console.log(`Issue already exists: ${title}`);
    return;
  }

  const data = JSON.stringify({ title });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/issues`,
    method: 'POST',
    headers: {
      'User-Agent': 'todo-seed-script',
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  const { status, body } = await apiRequest(options, data);
  if (status >= 200 && status < 300) {
    console.log(`Created issue: ${title}`);
  } else {
    throw new Error(`Failed to create issue ${title}: ${status} ${body}`);
  }
}

async function main() {
  const tasks = await loadTasks();
  for (const task of tasks) {
    try {
      await createIssue(task);
    } catch (err) {
      console.error(err.message);
    }
  }
}

main();

