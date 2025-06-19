# experimental-js-lexer

A modular, adaptive JavaScript lexer designed for autonomous development by OpenAI Codex agents.

---

## Quick Start
```bash
npm install
npm run ci          # lint + tests + coverage
```

Lex a snippet directly:
```bash
node index.js "let x = 42;"
```

---

## Project Board
Run
```bash
npm run sync:project
```
to (re-)create the GitHub project board and seed TODO issues.

## Benchmarks
```bash
npm run bench
```
Baseline numbers live in `.benchmarks/baseline.json`.

## Integration Hooks
See **`docs/VS_CODE_EXAMPLE.md`** for streaming-token examples.

## Plugin API
Custom readers / plugins can be registered at runtime – check **`docs/PLUGIN_API.md`**.

## Auto-Merge
Any PR labeled **`reader`** is merged automatically once CI passes and one approver reviews.
