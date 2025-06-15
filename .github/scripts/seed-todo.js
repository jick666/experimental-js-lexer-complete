const fs = require('fs');
const https = require('https');

const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPOSITORY;

if (!TOKEN) {
  console.error('GITHUB_TOKEN not provided');
  process.exit(1);
}

if (!REPO) {
  console.error('GITHUB_REPOSITORY not provided');
  process.exit(1);
}

const [owner, repo] = REPO.split('/');
const checklistPath = 'docs/TODO_CHECKLIST.md';

function getTodoItems() {
  if (!fs.existsSync(checklistPath)) {
    console.error(`Checklist not found at ${checklistPath}`);
    return [];
  }
  const content = fs.readFileSync(checklistPath, 'utf8');
  return content
    .split('\n')
    .filter(line => line.startsWith('- [ ] '))
    .map(line => line.replace('- [ ] ', '').trim());
}

function createIssue(title, body) {
  const data = JSON.stringify({ title, body });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${owner}/${repo}/issues`,
    method: 'POST',
    headers: {
      'Authorization': `token ${TOKEN}`,
      'User-Agent': 'seed-todo-script',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            resolve({});
          }
        } else {
          reject(new Error(`Failed: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const items = getTodoItems();
  for (const item of items) {
    try {
      const issue = await createIssue(item, item);
      console.log(`Created issue #${issue.number || '?'}: ${item}`);
    } catch (err) {
      console.error(`Error creating issue for "${item}": ${err.message}`);
    }
  }
}

main();
