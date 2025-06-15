import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const token = process.env.GITHUB_TOKEN;
const repoEnv = process.env.GITHUB_REPOSITORY;
if (!token) {
  console.error('Missing GITHUB_TOKEN');
  process.exit(1);
}
if (!repoEnv) {
  console.error('Missing GITHUB_REPOSITORY');
  process.exit(1);
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const [owner, repo] = repoEnv.split('/');
const checklistPath = path.resolve(__dirname, '../../docs/TODO_CHECKLIST.md');
const file = fs.readFileSync(checklistPath, 'utf8');
const tasks = file.split('\n').filter(line => /^- \[ \]/.test(line)).map(line => line.replace(/^- \[ \] /, '').trim());

function createIssue(title) {
  return new Promise((resolve, reject) => {
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

    const req = https.request(options, res => {
      let body = '';
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`Created issue: ${title}`);
          resolve();
        } else {
          reject(new Error(`Failed to create issue ${title}: ${res.statusCode} ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const task of tasks) {
    try {
      await createIssue(task);
    } catch (err) {
      console.error(err.message);
    }
  }
})();

