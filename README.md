# experimental-js-lexer

A modular, adaptive, experimental JavaScript lexer designed for autonomous development by OpenAI Codex agents.

## Quick Start

See `QUICK_START.md` for setup and development guidelines.

### Pre-commit
Run `npm install` once to set up Husky hooks. Commits will automatically run
`npm run lint` and `npm test` before being created.

## Project Board

Track progress and self-assign tasks on the [GitHub Project Board](https://github.com/your-org/experimental-js-lexer/projects/1).
The `setup-project-board.js` helper ensures a board with `Todo`, `In Progress`,
`Review`, and `Done` columns exists. Running the `seed-todo.js` script will
create issues from `docs/TODO_CHECKLIST.md` and place them in the **Todo**
column automatically.

## Code of Conduct

Please read `CODE_OF_CONDUCT.md` to understand expectations for participation.

## Changelog

All notable changes are tracked in `CHANGELOG.md`.

## Benchmarks

Measure lexing throughput on the sample files in `tests/fixtures`:

```bash
node tests/benchmarks/lexer.bench.js
```

## Integration Hooks

For editor integrations or other tooling that requires incremental lexing,
use the `IncrementalLexer` exported from `index.js`. Tokens will be emitted
as new source text is fed into the lexer, enabling real-time syntax
highlighting or analysis.

```javascript
import { IncrementalLexer } from 'experimental-js-lexer';

const collected = [];
const lexer = new IncrementalLexer({ onToken: t => collected.push(t.type) });

lexer.feed('let x');
lexer.feed(' = 1;');

console.log(collected);
// ['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'NUMBER', 'PUNCTUATION']
```

For editors that prefer a standard Node stream interface, use the
`createTokenStream` helper:

```javascript
import { createTokenStream } from 'experimental-js-lexer';

const stream = createTokenStream('let x = 1;');
stream.on('data', tok => {
  console.log(tok.type);
});
```

See `docs/VS_CODE_EXAMPLE.md` for a more complete VS Code integration example.

## Plugin API

Custom token readers can be installed at runtime. Register a plugin before
creating a lexer instance:

```javascript
import { registerPlugin, tokenize } from 'experimental-js-lexer';
import { MyPlugin } from './my-plugin.js';

registerPlugin(MyPlugin);
console.log(tokenize('#')); // tokens include MY custom types
```

See `docs/PLUGIN_API.md` for details on authoring plugins.

## Auto-Merge Workflow

Pull requests labeled `reader` are automatically merged once all CI checks
are successful and at least one approving review has been submitted. The
`Auto-Merge Reader PRs` GitHub action performs the squash merge when these
conditions are met.
