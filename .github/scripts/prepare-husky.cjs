#!/usr/bin/env node
// .github/scripts/prepare-husky.cjs

const { execSync } = require('child_process');

try {
  // verify we're in a git repo
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  console.log('✔️  Git repo detected — installing Husky hooks');
  execSync('npx husky install', { stdio: 'inherit' });
} catch {
  console.log('ℹ️  Not a Git repo — skipping Husky install');
}