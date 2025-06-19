#!/usr/bin/env node
import { execSync } from 'child_process';

const dryRun = process.argv.includes('--dry-run');

function log(level, msg) {
  console.log(`[${new Date().toISOString()}] [${level}] ${msg}`);
}

try {
  log('info', `agentic automation start${dryRun ? ' (dry-run)' : ''}`);
  if (dryRun) {
    log('info', 'would run: npm run workflow');
  } else {
    execSync('npm run workflow', { stdio: 'inherit' });
  }
  log('info', 'automation finished');
} catch (err) {
  log('error', err.message || String(err));
  process.exit(1);
}
