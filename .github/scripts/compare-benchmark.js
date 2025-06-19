#!/usr/bin/env node
import { readFileSync } from 'fs';

const [,, outPath, baselinePath] = process.argv;
if (!outPath || !baselinePath) {
  console.error('Usage: compare-benchmark <out> <baseline>');
  process.exit(1);
}

const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
const lines = readFileSync(outPath, 'utf8').trim().split(/\r?\n/);
const results = {};
for (const line of lines) {
  const m = line.match(/^([^:]+):\s*([\d.]+)/);
  if (m) results[m[1]] = parseFloat(m[2]);
}

let ok = true;
for (const [file, base] of Object.entries(baseline)) {
  const actual = results[file];
  if (actual === undefined) {
    console.error(`Missing benchmark for ${file}`);
    ok = false;
    continue;
  }
  const ratio = actual / base;
  if (ratio < 0.9) {
    console.error(`${file}: ${actual.toFixed(2)} MB/s < 90% of baseline ${base}`);
    ok = false;
  } else {
    console.log(`${file}: ${actual.toFixed(2)} MB/s (${(ratio*100).toFixed(1)}% of baseline)`);
  }
}
if (!ok) process.exit(1);
