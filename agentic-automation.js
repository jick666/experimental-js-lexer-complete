#!/usr/bin/env node
/**
 * agentic-automation.js
 *
 * Automatically scaffolds enhanced agentic automation:
 *  - Updates .codex/promptMap.json with new reader & integration tasks
 *  - Generates GitHub Actions workflows for auto-merge, drift-check, benchmarks, test generation, VSCode extension publish
 *  - Adds helper scripts under .github/scripts for drift detection, TODO closing, benchmark comparison, test stubs
 *  - Initializes a benchmarks baseline
 *  - Refreshes docs/TODO_CHECKLIST.md with the extended reader support checklist
 *
 * Run from the repo root: `node agentic-automation.js`
 */

import fs from 'fs';
import path from 'path';

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✔ ${filePath}`);
}

// 1) Update .codex/promptMap.json
const codexDir = path.join('.codex');
const promptMapFile = path.join(codexDir, 'promptMap.json');
ensureDir(codexDir);

let promptMap = {};
if (fs.existsSync(promptMapFile)) {
  try {
    promptMap = JSON.parse(fs.readFileSync(promptMapFile, 'utf8'));
  } catch (err) {
    console.warn(`⚠️  Invalid JSON in ${promptMapFile}, resetting to empty object.`);
    promptMap = {};
  }
}

Object.assign(promptMap, {
  "HexReader": {
    "prompt": "Implement HexReader: parse 0x… hexadecimal literals per docs/LEXER_SPEC.md §4.2. Add src/lexer/HexReader.js and tests/readers/HexReader.test.js.",
    "files": ["src/lexer/HexReader.js", "tests/readers/HexReader.test.js"]
  },
  "BinaryReader": {
    "prompt": "Implement BinaryReader: parse 0b… binary literals per docs/LEXER_SPEC.md §4.2. Add src/lexer/BinaryReader.js and tests/readers/BinaryReader.test.js.",
    "files": ["src/lexer/BinaryReader.js", "tests/readers/BinaryReader.test.js"]
  },
  "OctalReader": {
    "prompt": "Implement OctalReader: parse 0o… octal literals per docs/LEXER_SPEC.md §4.2. Add src/lexer/OctalReader.js and tests/readers/OctalReader.test.js.",
    "files": ["src/lexer/OctalReader.js", "tests/readers/OctalReader.test.js"]
  },
  "ExponentReader": {
    "prompt": "Implement ExponentReader: parse 1e10-style exponentials per docs/LEXER_SPEC.md §4.2. Add src/lexer/ExponentReader.js and tests/readers/ExponentReader.test.js.",
    "files": ["src/lexer/ExponentReader.js", "tests/readers/ExponentReader.test.js"]
  },
  "NumericSeparatorReader": {
    "prompt": "Implement NumericSeparatorReader: parse numeric separators (1_000) per docs/LEXER_SPEC.md §4.2. Add src/lexer/NumericSeparatorReader.js and tests/readers/NumericSeparatorReader.test.js.",
    "files": ["src/lexer/NumericSeparatorReader.js", "tests/readers/NumericSeparatorReader.test.js"]
  },
  "UnicodeIdentifierReader": {
    "prompt": "Implement UnicodeIdentifierReader: accept full Unicode identifier start/part per docs/LEXER_SPEC.md §4.1. Add src/lexer/UnicodeIdentifierReader.js and tests/readers/UnicodeIdentifierReader.test.js.",
    "files": ["src/lexer/UnicodeIdentifierReader.js", "tests/readers/UnicodeIdentifierReader.test.js"]
  },
  "ShebangReader": {
    "prompt": "Implement ShebangReader: consume #!…\\n at file start as a COMMENT token per docs/LEXER_SPEC.md §4.8. Add src/lexer/ShebangReader.js and tests/readers/ShebangReader.test.js.",
    "files": ["src/lexer/ShebangReader.js", "tests/readers/ShebangReader.test.js"]
  },
  "BufferedIncrementalLexer": {
    "prompt": "Implement BufferedIncrementalLexer: buffer incomplete tokens in incremental feed mode. Add src/integration/BufferedIncrementalLexer.js and tests/integration/BufferedIncrementalLexer.test.js.",
    "files": ["src/integration/BufferedIncrementalLexer.js", "tests/integration/BufferedIncrementalLexer.test.js"]
  },
  "VSCodeExtension": {
    "prompt": "Scaffold a VS Code extension under extension/ wrapping createTokenStream, include package.json, extension.ts, vsce.yml, build & publish scripts.",
    "files": ["extension/package.json", "extension/src/extension.ts", "extension/vsce.yml"]
  }
});

writeFile(promptMapFile, JSON.stringify(promptMap, null, 2));

// 2) Generate GitHub Actions workflows
const workflowsDir = path.join('.github', 'workflows');
ensureDir(workflowsDir);

const workflows = {
  'auto-merge.yml': `name: Auto-Merge Reader PRs
on:
  pull_request:
    types: [labeled, synchronize, opened]
jobs:
  automerge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - uses: pascalgn/automerge-action@v0.14.3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          merge_method: squash
      - run: node .github/scripts/close-todo.js
`,

  'drift-check.yml': `name: Spec-Code Drift Check
on:
  schedule:
    - cron: '0 2 * * *'
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: node .github/scripts/check-drift.js
`,

  'benchmarks.yml': `name: Nightly Benchmarks
on:
  schedule:
    - cron: '0 3 * * *'
jobs:
  bench:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: node tests/benchmarks/lexer.bench.js > bench-output.txt
      - run: node .github/scripts/compare-benchmark.js bench-output.txt .benchmarks/baseline.json
      - uses: actions/upload-artifact@v3
        with:
          name: bench-output
          path: bench-output.txt
`,

  'generate-tests.yml': `name: Generate Tests From Spec
on:
  push:
    paths:
      - 'docs/LEXER_SPEC.md'
jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: node .github/scripts/generate-tests.js
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "chore(tests): auto-generated from spec"
`,

  'publish-vscode.yml': `name: Publish VS Code Extension
on:
  release:
    types: [published]
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build:extension
      - run: npm install -g vsce
      - env:
          VSCE_TOKEN: \${{ secrets.VSCE_TOKEN }}
        run: vsce publish --pat \${VSCE_TOKEN}
`
};

for (const [fname, content] of Object.entries(workflows)) {
  writeFile(path.join(workflowsDir, fname), content);
}

// 3) Create helper scripts under .github/scripts
const scriptsDir = path.join('.github', 'scripts');
ensureDir(scriptsDir);

const scripts = {
  'check-drift.js': `#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Extract reader names from spec
const spec = fs.readFileSync('docs/LEXER_SPEC.md', 'utf8');
const readers = Array.from(spec.matchAll(/§\\d+\\.\\d+\\s+([A-Za-z]+Reader)/g)).map(m => m[1]);

// Extract implemented readers from engine
const engineSrc = fs.readFileSync('src/lexer/LexerEngine.js', 'utf8');
const implemented = Array.from(engineSrc.matchAll(/\\b([A-Za-z]+Reader)\\b/g)).map(m => m[1]);

const missing = readers.filter(r => !implemented.includes(r));
if (missing.length) {
  console.log('🔍 Missing readers:', missing.join(', '));
  missing.forEach(r => {
    execSync(\`gh issue create --title "[Reader] \${r}" --body "Spec includes \${r} but it is not implemented." --label reader,auto-generated\`);
  });
} else {
  console.log('✅ No drift detected – all spec readers implemented.');
}
`,

  'close-todo.js': `#!/usr/bin/env node
import { execSync } from 'child_process';

// Close issues for implemented readers based on recent commits
const logs = execSync('git log -n 20 --pretty=format:"%s"').toString();
const implemented = Array.from(logs.matchAll(/feat\\(reader\\):\\s*([A-Za-z]+Reader)/g)).map(m => m[1]);

new Set(implemented).forEach(r => {
  console.log(\`Closing TODO: \${r}\`);
  execSync(\`gh issue close "TODO: \${r}"\`, { stdio: 'inherit' });
});
`,

  'compare-benchmark.js': `#!/usr/bin/env node
import fs from 'fs';

const [,, outFile, baseFile] = process.argv;
const lines = fs.readFileSync(outFile, 'utf8').trim().split('\\n');
const results = lines.map(l => {
  const [file, mbps] = l.split(':').map(s => s.trim());
  return { file, mbps: parseFloat(mbps) };
});

const baseline = JSON.parse(fs.readFileSync(baseFile, 'utf8'));
let regression = false;

for (const { file, mbps } of results) {
  if (baseline[file] && mbps < baseline[file] * 0.9) {
    console.error(\`🔻 Regression detected in \${file}: baseline=\${baseline[file]} MB/s, current=\${mbps} MB/s\`);
    regression = true;
  }
}

if (regression) process.exit(1);
`,

  'generate-tests.js': `#!/usr/bin/env node
console.log("⚠️  generate-tests.js stub – integrate your test-generation agent here.");
process.exit(0);
`
};

for (const [fname, content] of Object.entries(scripts)) {
  const full = path.join(scriptsDir, fname);
  writeFile(full, content);
  fs.chmodSync(full, 0o755);
}

// 4) Initialize benchmarks baseline
const benchDir = '.benchmarks';
ensureDir(benchDir);
writeFile(path.join(benchDir, 'baseline.json'), JSON.stringify({
  "lexer_engine.js": 55.0,
  "template_string_reader.js": 110.0
}, null, 2));

// 5) Refresh docs/TODO_CHECKLIST.md
const todoList = `### Extended Reader & Integration Tasks

- [ ] Implement HexReader (0x… literals)
- [ ] Implement BinaryReader (0b… literals)
- [ ] Implement OctalReader (0o… literals)
- [ ] Implement ExponentReader (1e… literals)
- [ ] Implement NumericSeparatorReader (1_000 separators)
- [ ] Implement UnicodeIdentifierReader (full Unicode support)
- [ ] Implement ShebangReader (#!… file headers)
- [ ] Buffer tokens in BufferedIncrementalLexer
- [ ] Scaffold VS Code Extension under \`extension/\`
- [ ] Enhance RegexOrDivideReader to handle character classes
`;

ensureDir('docs');
writeFile(path.join('docs', 'TODO_CHECKLIST.md'), todoList);

console.log('\n🎉 Agentic automation scaffolding complete.');
