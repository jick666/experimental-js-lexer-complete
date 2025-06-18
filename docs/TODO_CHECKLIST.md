### 1. CharStream
- [x] Implement and verify that CharStream exposes the methods `current()`, `peek(offset)`, `advance()`, `eof()`, and `getPosition()`.

### 2. Token
- [x] Ensure the Token constructor correctly stores `type`, `value`, `start`, and `end`, and implement a working `toJSON()` method.

### 3. LexerEngine
- [x] Initialize the `stateStack` in `LexerEngine`, dispatch reader functions based on the current mode, and implement `nextToken()` with a proper EOF fallback.

### 4. IdentifierReader
- [x] Detect sequences of letters and underscores in `IdentifierReader` and emit them as `IDENTIFIER` tokens.

### 5. NumberReader
- [x] Parse digit sequences (with an optional decimal point) in `NumberReader` and emit them as `NUMBER` tokens.

### 6. OperatorReader
- [x] Handle single- and multi-character operators in `OperatorReader` and emit them as `OPERATOR` tokens.

### 7. PunctuationReader
- [x] Recognize punctuation characters (e.g. `{}`, `()`, `;`, `,`) in `PunctuationReader` and emit them as `PUNCTUATION` tokens.

### 8. RegexOrDivideReader
- [x] Context-sensitively distinguish between a regex literal and the division operator in `RegexOrDivideReader`, emitting `REGEX` or `DIVIDE` appropriately.

### 9. TemplateStringReader
- [x] Support backtick-delimited template strings with `${…}` interpolations in `TemplateStringReader`, emitting `TEMPLATE_STRING` tokens with embedded-expression boundaries.

### 10. WhitespaceReader
- [x] Skip whitespace in `WhitespaceReader`, preserving it as trivia if needed, and ensure it doesn't produce substantive tokens.

### 11. Integration & Tooling
- [x] Expose a CLI entrypoint in `index.js`, enforce code style with `.eslintrc.json`, and wire up the CI workflow in `.github/workflows/ci.yml`.

### 12. Extended Reader Support
- [x] Add JSX mode and handle advanced string-literal forms for Extended Reader Support.

### 13. ECMAScript Coverage
- [x] Develop additional readers to cover full modern ECMAScript syntax.

### 14. Performance Analysis
- [x] Benchmark tokenization on large files and identify hotspots for performance optimizations.

### 15. Performance Optimization
- [x] Optimize the lexer code to maximize tokens-per-second throughput.

### 16. Documentation Expansion
- [x] Expand `docs/LEXER_SPEC.md` with more edge-case examples and add clear usage snippets and 'getting started' examples.

### 17. Syntax Highlighting Integration
- [x] Build a syntax-highlighting integration hook so editors can consume tokens directly.

### 18. Error Reporting Improvements
- [x] Enhance `LexerError` to include source context (line, column, snippet) and meaningful messages.

### 19. TypeScript Support
- [x] Generate and distribute `.d.ts` declaration files and migrate the source codebase to TypeScript for TypeScript support.

### 20. Plugin API
- [ ] Design and implement a runtime plugin system that allows registering custom reader modules for the plugin API.
