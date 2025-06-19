#!/usr/bin/env node
/**
 * compare-benchmark.js <current.txt> <baseline.json>
 *
 * Fails (exit-code 1) if any file is slower than baseline × 0.9
 */
import fs from 'fs';

const [, , currentFile, baselineFile] = process.argv;

if (!currentFile || !baselineFile) {
  console.error('Usage: compare-benchmark.js <current.txt> <baseline.json>');
  process.exit(1);
}

const results = Object.fromEntries(
  fs
    .readFileSync(currentFile, 'utf8')
    .trim()
    .split('\n')
    .map(line => {
      const [file, mbps] = line.split(':').map(s => s.trim());
      return [file, parseFloat(mbps)];
    })
);

const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));

let failed = false;
for (const [file, baseMbps] of Object.entries(baseline)) {
  const cur = results[file];
  if (cur !== undefined && cur < baseMbps * 0.9) {
    console.error(`🔻  ${file}: ${cur.toFixed(2)} MB/s (baseline ${baseMbps})`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
