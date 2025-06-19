### Extended Reader & Integration Tasks

- [x] Implement HexReader (0x… literals)
- [x] Implement BinaryReader (0b… literals)
- [x] Implement OctalReader (0o… literals)
- [x] Implement ExponentReader (1e… literals)
- [x] Implement NumericSeparatorReader (1_000 separators)
- [x] Implement UnicodeIdentifierReader (full Unicode support)
- [x] Implement ShebangReader (#!… file headers)
- [x] Buffer tokens in BufferedIncrementalLexer
- [x] Scaffold VS Code Extension under `extension/`
- [x] Enhance RegexOrDivideReader to handle character classes

### New Feature & Optimization Tasks

 - [x] Implement PipelineOperatorReader for `|>` expressions
 - [x] Implement DoExpressionReader to support `do { }` syntax
- [ ] Add TypeScriptPlugin providing decorators and type annotations
- [ ] Benchmark lexer speed and optimize CharStream caching
- [ ] Document incremental lexer state persistence
