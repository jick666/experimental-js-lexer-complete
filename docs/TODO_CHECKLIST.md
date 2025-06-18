### 1. CharStream (§1)
- [x] `current()`
- [x] `peek(offset)`
- [x] `advance()`
- [x] `eof()`
- [x] `getPosition()`

### 2. Token (§2)
- [x] constructor stores `type`, `value`, `start`, `end`
- [x] `toJSON()`

### 3. LexerEngine (§3)
- [x] initialize `stateStack`
- [x] dispatch readers by mode
- [x] `nextToken()` fallback + EOF

### 4. IdentifierReader (§4.1)
- [x] letters & underscores → `IDENTIFIER`

### 5. NumberReader (§4.2)
- [x] digits with optional `.` → `NUMBER`

### 6. OperatorReader (§4.3)
- [x] single & multi-char → `OPERATOR`

### 7. PunctuationReader (§4.4)
- [x] punctuation chars → `PUNCTUATION`

### 8. RegexOrDivideReader (§4.5)
 - [x] context-sensitive regex vs `/` → `REGEX` or `DIVIDE`

### 9. TemplateStringReader (§4.6)
 - [x] backticks, `${}` embedded → `TEMPLATE_STRING`

### 10. WhitespaceReader (§4.7)
 - [x] skip whitespace, attach trivia

### 11. Integration & Tooling
- [x] `index.js` CLI
- [x] `.eslintrc.json` (§8)
- [x] CI workflow (`.github/workflows/ci.yml`)

### 12. Extended Reader Support
- [ ] JSX mode and advanced string literals
- [ ] additional readers for full ECMAScript

### 13. Performance Optimizations
- [x] benchmark large files
- [x] optimize tokenization speed

### 14. Documentation Expansion
- [x] cover more edge cases in `docs/LEXER_SPEC.md`
- [x] add usage examples

### 15. Integration Hooks
- [x] incremental lexing for editors
- [ ] syntax highlighting integration

### 16. Error Reporting Improvements
- [x] clearer `LexerError` messages with context

### 17. TypeScript Support
- [ ] distribute `.d.ts` files
- [ ] migrate source to TypeScript

### 18. Plugin API
- [ ] allow registering custom readers at runtime
