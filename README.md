# experimental-js-lexer

A modular, adaptive, experimental JavaScript lexer designed for autonomous development by OpenAI Codex agents.

## Quick Start

See `QUICK_START.md` for setup and development guidelines.

### CLI Example

Tokenize a snippet containing comments and a template string:

```bash
node index.js "/* greeting */ let msg = `hi`; // end" --verbose
```

Outputs

```
Token { type: 'COMMENT', value: '/* greeting */', ... }
Token { type: 'KEYWORD', value: 'let', ... }
Token { type: 'IDENTIFIER', value: 'msg', ... }
Token { type: 'OPERATOR', value: '=', ... }
Token { type: 'TEMPLATE_STRING', value: '`hi`', ... }
Token { type: 'PUNCTUATION', value: ';', ... }
Token { type: 'COMMENT', value: '// end', ... }
[
  ...
]
```

## Project Board

Track progress and self-assign tasks on the [GitHub Project Board](https://github.com/your-org/experimental-js-lexer/projects/1).

## Code of Conduct

Please read `CODE_OF_CONDUCT.md` to understand expectations for participation.

## Changelog

All notable changes are tracked in `CHANGELOG.md`.
