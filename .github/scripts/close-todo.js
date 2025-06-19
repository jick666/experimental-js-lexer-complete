#!/usr/bin/env node
/**
 * Closes “TODO: …Reader” issues that correspond to readers
 * merged in the last N commits.  Silently skips if the gh CLI
 * isn’t available.
 */
import { execSync, spawnSync } from 'child_process';

const COMMITS_TO_SCAN = 50;            // tweak to taste
const ghAvailable = spawnSync('gh', ['--version'], { stdio: 'ignore' }).status === 0;

if (!ghAvailable) {
  console.log('ℹ️  gh CLI not found – skipping automatic TODO closure.');
  process.exit(0);
}

const log = execSync(`git log -n ${COMMITS_TO_SCAN} --pretty=%s`).toString();
const mergedReaders = [
  ...log.matchAll(/feat\(reader\):\s*([A-Za-z]+Reader)/g)
].map(m => m[1]);

[...new Set(mergedReaders)].forEach(reader => {
  const title = `"TODO: ${reader}"`;
  console.log(`✓ Closing ${title}`);
  execSync(`gh issue close ${title}`, { stdio: 'inherit' });
});
