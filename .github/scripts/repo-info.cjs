#!/usr/bin/env node
// .github/scripts/repo-info.cjs
// Summarize key repo information for new agents
const fs = require('fs');
const path = require('path');

function heading(title) {
  console.log(`\n=== ${title} ===`);
}

heading('Node Version');
console.log(process.version);

heading('NPM Scripts');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
for (const [name, cmd] of Object.entries(pkg.scripts || {})) {
  console.log(`${name}: ${cmd}`);
}

heading('Open Tasks');
const todoPath = path.join('docs', 'TODO_CHECKLIST.md');
if (fs.existsSync(todoPath)) {
  const text = fs.readFileSync(todoPath, 'utf8');
  const tasks = text.match(/^\- \[ \] .+$/gm) || [];
  if (tasks.length) {
    tasks.forEach(t => console.log(t.replace('- [ ] ', '')));
  } else {
    console.log('No open tasks!');
  }
} else {
  console.log('No TODO_CHECKLIST.md found');
}

heading('Next Task');
const nextTaskScript = path.join('.github', 'scripts', 'next-task.cjs');
if (fs.existsSync(nextTaskScript)) {
  const { spawnSync } = require('child_process');
  const res = spawnSync('node', [nextTaskScript]);
  process.stdout.write(res.stdout);
} else {
  console.log('next-task.cjs not found');
}
