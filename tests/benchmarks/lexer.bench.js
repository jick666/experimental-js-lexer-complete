import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync } from 'fs';
import { tokenize } from '../../index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function benchmark(filePath, iterations = 50) {
  const code = readFileSync(filePath, 'utf8');
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    tokenize(code);
  }
  const durationNs = Number(process.hrtime.bigint() - start);
  const seconds = durationNs / 1e9;
  const bytes = Buffer.byteLength(code) * iterations;
  const mbps = bytes / (1024 * 1024) / seconds;
  console.log(`${basename(filePath)}: ${mbps.toFixed(2)} MB/s`);
}

(function main() {
  const fixtureDir = join(__dirname, '..', 'fixtures');
  const files = readdirSync(fixtureDir).filter(f => f.endsWith('.js'));
  if (files.length === 0) {
    console.error('No fixture files found in tests/fixtures');
    process.exit(1);
  }
  files.forEach(f => benchmark(join(fixtureDir, f)));
})();
