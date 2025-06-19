#!/usr/bin/env node
/**
 * Compares readers listed in docs/LEXER_SPEC.md with those wired into
 * src/lexer/LexerEngine.js.  Optionally raises GitHub issues if drift exists
 * **and** the gh CLI + credentials are available.
 */
import fs from 'fs';
import { execSync } from 'child_process';
import { spawnSync } from 'child_process';

// ---------- helpers ----------
function hasGhCli() {
  return spawnSync('gh', ['--version'], { stdio: 'ignore' }).status === 0;
}

function openIssue(reader) {
  try {
    execSync(
      `gh issue create --title "[Reader] ${reader}" ` +
        `--body "Spec mentions ${reader} but it’s not implemented." ` +
        '--label reader,auto-generated',
      { stdio: 'inherit' }
    );
  } catch (err) {
    console.error(`⚠️  Could not open issue for ${reader}: ${err.message}`);
  }
}

// ---------- main ----------
const spec = fs.readFileSync('docs/LEXER_SPEC.md', 'utf8');
const specReaders = [...spec.matchAll(/§\d+\.\d+\s+([A-Za-z]+Reader)/g)].map(m => m[1]);

const engine = fs.readFileSync('src/lexer/LexerEngine.js', 'utf8');
const implReaders = [...engine.matchAll(/\b([A-Za-z]+Reader)\b/g)].map(m => m[1]);

const missing = specReaders.filter(r => !implReaders.includes(r));

if (missing.length === 0) {
  console.log('✅  No drift detected – all spec readers implemented.');
  process.exit(0);
}

console.log('🔍  Missing readers:', missing.join(', '));

if (hasGhCli()) {
  missing.forEach(openIssue);
} else {
  console.log('ℹ️  gh CLI not found – skipped automatic issue creation.');
}
