#!/usr/bin/env node
/**
 * scripts/check.cjs
 *
 * 1) ESLint
 * 2) Jest + coverage report
 * 3) Benchmark regression check (<=10 % drop allowed)
 */
import { execSync } from 'child_process';
import fs from 'fs';

function run(cmd, opts = {}) {
  console.log(`\n› ${cmd}`);
  execSync(cmd, { stdio: 'inherit', ...opts });
}

run('eslint .');
run('node --experimental-vm-modules ./node_modules/jest/bin/jest.js --coverage');

run('node tests/benchmarks/lexer.bench.js > bench-current.txt');
run('node .github/scripts/compare-benchmark.js bench-current.txt .benchmarks/baseline.json');

fs.rmSync('bench-current.txt');
console.log('\n✔ all checks passed');
