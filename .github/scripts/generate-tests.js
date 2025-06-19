#!/usr/bin/env node
const dryRun = process.argv.includes('--dry-run');
if (dryRun) {
  console.log('[dry-run] generate-tests skipped');
  process.exit(0);
}
console.log("ℹ️  generate-tests: stub – add your generator here.");
