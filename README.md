# experimental-js-lexer

A modular, adaptive, experimental JavaScript lexer designed for autonomous development by OpenAI Codex agents.

## Quick Start

See `QUICK_START.md` for setup and development guidelines.

## Project Board

Track progress and self-assign tasks on the [GitHub Project Board](https://github.com/your-org/experimental-js-lexer/projects/1).

## Code of Conduct

Please read `CODE_OF_CONDUCT.md` to understand expectations for participation.

## Changelog

All notable changes are tracked in `CHANGELOG.md`.

## Example

Tokenizing a quoted string emits a `STRING` token:

```js
import { tokenize } from './index.js';
console.log(tokenize("'hello'").map(t => t.type));
// => ['STRING']
```
