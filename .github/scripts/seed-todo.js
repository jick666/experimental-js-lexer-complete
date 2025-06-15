const fs = require('fs');
const { Octokit } = require('@octokit/rest');

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error('GITHUB_TOKEN env var required');
  process.exit(1);
}

const repoFull = process.env.GITHUB_REPOSITORY;
if (!repoFull) {
  console.error('GITHUB_REPOSITORY env var required');
  process.exit(1);
}
const [owner, repo] = repoFull.split('/');

const octokit = new Octokit({ auth: token });

async function getExistingTitles() {
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner,
    repo,
    state: 'open',
    per_page: 100,
  });
  return new Set(issues.map(i => i.title));
}

function parseTodos(file) {
  const content = fs.readFileSync(file, 'utf8');
  const todos = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^\- \[ \] (.+)/);
    if (match) todos.push(match[1].replace(/`/g, ''));
  }
  return todos;
}

async function main() {
  const titles = await getExistingTitles();
  const todos = parseTodos('docs/TODO_CHECKLIST.md');
  for (const task of todos) {
    const title = `TODO: ${task}`;
    if (titles.has(title)) continue;
    await octokit.rest.issues.create({
      owner,
      repo,
      title,
      body: 'Auto-generated task from TODO_CHECKLIST.md',
      labels: ['todo'],
    });
    console.log(`Created issue: ${title}`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

