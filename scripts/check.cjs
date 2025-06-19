#!/usr/bin/env node
/**
 * scripts/check.cjs
 *
 * 1) ESLint
 * 2) Jest (coverage)
 * 3) Benchmarks  + 10 %-regression guard
 */
const { execSync } = require('child_process');
const fs           = require('fs');

function run(cmd) {
  console.log(`\n› ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

run('npm run lint');
run('npm test');

run('node tests/benchmarks/lexer.bench.js > tests/benchmarks/out.txt');
run('node .github/scripts/compare-benchmark.js tests/benchmarks/out.txt .benchmarks/baseline.json');

fs.rmSync('tests/benchmarks/out.txt');
console.log('\n✔  all checks passed');