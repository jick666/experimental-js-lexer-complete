#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Extract reader names from spec
const spec = fs.readFileSync('docs/LEXER_SPEC.md', 'utf8');
const readers = Array.from(spec.matchAll(/§\d+\.\d+\s+([A-Za-z]+Reader)/g)).map(m => m[1]);

// Extract implemented readers from engine
const engineSrc = fs.readFileSync('src/lexer/LexerEngine.js', 'utf8');
const implemented = Array.from(engineSrc.matchAll(/\b([A-Za-z]+Reader)\b/g)).map(m => m[1]);

const missing = readers.filter(r => !implemented.includes(r));
if (missing.length) {
  console.log('🔍 Missing readers:', missing.join(', '));
  missing.forEach(r => {
    execSync(`gh issue create --title "[Reader] ${r}" --body "Spec includes ${r} but it is not implemented." --label reader,auto-generated`);
  });
} else {
  console.log('✅ No drift detected – all spec readers implemented.');
}
