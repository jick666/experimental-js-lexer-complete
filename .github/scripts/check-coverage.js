#!/usr/bin/env node
import { checkCoverage } from '../../src/utils/checkCoverage.js';

try {
  checkCoverage(90);
  console.log('Coverage meets threshold.');
} catch (err) {
  console.error(err.message);
  process.exit(1);
}
