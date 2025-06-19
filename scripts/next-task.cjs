#!/usr/bin/env node
// scripts/next-task.cjs
// Print the highest priority unchecked task from docs/TODO_CHECKLIST.md
const fs = require('fs');
const path = require('path');

const checklistPath = path.join('docs', 'TODO_CHECKLIST.md');
const content = fs.readFileSync(checklistPath, 'utf8');
const match = content.match(/^- \[ \] (.+)$/m);
if (match) {
  console.log(match[1]);
} else {
  console.log('All tasks completed');
}
