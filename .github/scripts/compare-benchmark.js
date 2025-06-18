#!/usr/bin/env node
import fs from 'fs';

const [,, outFile, baseFile] = process.argv;
const lines = fs.readFileSync(outFile, 'utf8').trim().split('\n');
const results = lines.map(l => {
  const [file, mbps] = l.split(':').map(s => s.trim());
  return { file, mbps: parseFloat(mbps) };
});

const baseline = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
let regression = false;

for (const { file, mbps } of results) {
  if (baseline[file] && mbps < baseline[file] * 0.9) {
    console.error(`🔻 Regression detected in ${file}: baseline=${baseline[file]} MB/s, current=${mbps} MB/s`);
    regression = true;
  }
}

if (regression) process.exit(1);
