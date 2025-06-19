#!/usr/bin/env node
/**
 * compare-benchmark.js <current.txt> <baseline.json>
 * Fails CI if any throughput drops below 90 % of baseline.
 */
import fs from "fs";
const dryRun = process.argv.includes('--dry-run');

const [, , currentFile, baselineFile] = process.argv;
if (!currentFile || !baselineFile) {
  console.error("Usage: compare-benchmark.js <current.txt> <baseline.json>");
  process.exit(1);
}

const current = Object.fromEntries(
  fs.readFileSync(currentFile, "utf8").trim().split("\n").map(l => {
    const [file, mbps] = l.split(":").map(s => s.trim());
    return [file, Number(mbps)];
  })
);

const baseline = JSON.parse(fs.readFileSync(baselineFile, "utf8"));

let fail = false;
for (const [file, base] of Object.entries(baseline)) {
  const cur = current[file];
  if (cur !== undefined && cur < base * 0.9) {
    console.error(`🔻  ${file}: ${cur.toFixed(2)} MB/s (baseline ${base})`);
    fail = true;
  }
}
if (dryRun) {
  console.log(`[dry-run] benchmark comparison result: ${fail ? 'fail' : 'pass'}`);
  process.exit(0);
}
process.exit(fail ? 1 : 0);
