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
- [x] Add TypeScriptPlugin providing decorators and type annotations
- [x] Benchmark lexer speed and optimize CharStream caching
- [x] Document incremental lexer state persistence

### Future Lexical Enhancement Tasks

- [x] Implement PrivateIdentifierReader for `#private` fields
- [x] Support named capture groups in regular expressions
- [x] Recognize import assertion syntax after `import` statements
- [x] Add RecordAndTupleReader for `#[...]` and `#{...}` syntax
- [x] Support Unicode property escapes `\p{}` and `\P{}` in regular expressions
 - [x] Implement HTML comment reader for `<!--` and `-->`
- [x] Add ModuleBlockReader for `module { ... }` blocks
- [x] Support decimal literals like `123.45m` or `0d123.45`
- [x] Tokenize `using` and `await using` statements
- [x] Add tokens for pattern matching `match`/`case` syntax

#### Proposed Future Enhancements

- [x] Implement FunctionSentReader for `function.sent` meta property
- [x] Add BindOperatorReader for `::` method binding
 - [x] Extend RegexOrDivideReader to support Unicode sets with the `v` flag
- [x] Provide FlowTypePlugin for Flow-specific syntax

##### Additional Lexical Improvements

- [ ] Implement ByteOrderMarkReader for handling BOM at file start
- [ ] Parse `//# sourceMappingURL=` comments for tool integration
- [ ] Normalize all Unicode whitespace via UnicodeWhitespaceReader
- [ ] Add ErrorRecoveryMode to skip malformed tokens gracefully
