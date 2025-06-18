#!/usr/bin/env node
import { execSync } from 'child_process';

// Close issues for implemented readers based on recent commits
const logs = execSync('git log -n 20 --pretty=format:"%s"').toString();
const implemented = Array.from(logs.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)).map(m => m[1]);

new Set(implemented).forEach(r => {
  console.log(`Closing TODO: ${r}`);
  execSync(`gh issue close "TODO: ${r}"`, { stdio: 'inherit' });
});
