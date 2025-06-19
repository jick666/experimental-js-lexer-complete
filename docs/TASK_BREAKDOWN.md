# Task Breakdown for Remaining TODO Items

This document outlines detailed subtasks for each remaining objective in `TODO_CHECKLIST.md`.

## 12. Extended Reader Support
- [x] Implement a `JSXReader` capable of tokenizing JSX syntax.
- [x] Add a `jsx` mode in `LexerEngine` and dispatch to `JSXReader`.
- [x] Support advanced string literals (multi-line, escape forms) in a dedicated reader.
- [x] Update unit tests covering JSX and new string literals.
- [x] Document usage and edge cases in `docs/LEXER_SPEC.md`.

## 13. ECMAScript Coverage
- [x] Create readers for remaining ECMAScript features (e.g. bigints, optional chaining, nullish coalescing).
- [x] Expand grammar and tests to validate new tokens.

## 17. Syntax Highlighting Integration
- [x] Expose a stable API that streams tokens for editor consumption.
- [x] Provide a reference integration example for a popular editor.

## 19. TypeScript Support
- [x] Migrate source files to TypeScript or generate `.d.ts` declarations.
- [x] Include build steps and update CI to compile TypeScript.

## 20. Plugin API
- [x] Design a registration mechanism for custom reader plugins.
- [x] Implement plugin loading and lifecycle hooks.
- [x] Document how to build and register plugins.

## 21. Pipeline Operator
 - [x] Define `PIPELINE_OPERATOR` token type.
 - [x] Implement `PipelineOperatorReader` to emit this token.
 - [x] Add unit tests ensuring `a |> b` tokenizes correctly.
 - [x] Document new syntax in `docs/LEXER_SPEC.md`.

## 22. Do Expressions
- [x] Add `DoExpressionReader` for `do { ... }` blocks.
- [x] Handle nested `do` blocks with the state stack.
- [x] Test token sequence for simple examples.
- [x] Document behavior and edge cases.

## 23. TypeScript Plugin
- [ ] Create `TypeScriptPlugin` under `src/plugins/typescript`.
- [ ] Add readers for decorators and type annotations.
- [ ] Support generic type parameters.
- [ ] Document plugin usage with examples.
- [ ] Write unit tests for plugin tokens.

## 24. Performance Benchmarks
- [x] Add benchmark script using Node's `perf_hooks`.
- [x] Document baseline results in `README.md`.
- [x] Investigate CharStream caching optimizations.
- [x] Update changelog with performance metrics.

## 25. Incremental Lexer Persistence
- [x] Document how to save and restore lexer state.
- [x] Provide example code snippet in `README.md`.
- [x] Add tests covering lexing resume functionality.

## 26. Private Identifiers
- [x] Add `PrivateIdentifierReader` for tokens like `#field`.
- [x] Insert the reader early in `LexerEngine`'s default mode.
- [x] Write unit tests covering class fields and methods.
- [x] Document new `PRIVATE_IDENTIFIER` token in `docs/LEXER_SPEC.md`.

## 27. Regex Named Capture Groups
- [ ] Extend `RegexOrDivideReader` to recognize `(?<name>...)` syntax.
- [ ] Validate capture group names using identifier rules.
- [ ] Add tests with single and multiple named groups.
- [ ] Document named group parsing rules and limitations.

## 28. Import Assertions
 - [x] Implement `ImportAssertionReader` handling `assert { ... }` clauses.
 - [x] Hook the reader into import parsing flows in `LexerEngine`.
 - [x] Test static and dynamic import assertion examples.
 - [x] Document the new syntax in usage docs.

## 29. Record and Tuple Syntax
- [ ] Implement `RecordAndTupleReader` to tokenize `#{}` and `#[]` constructs.
- [ ] Integrate the reader into default mode of `LexerEngine`.
- [ ] Add unit tests for record and tuple literals.
- [ ] Document record and tuple tokenization in `docs/LEXER_SPEC.md`.

## 30. Unicode Property Escapes
- [x] Extend `RegexOrDivideReader` to support `\p{...}` and `\P{...}` escapes.
- [x] Validate property names using Unicode property data.
- [x] Provide tests covering positive and negative property escapes.
- [x] Document supported properties and limitations.

## 31. HTML Comment Support
- [x] Add `HTMLCommentReader` for `<!--` and `-->`.
- [x] Allow HTML-style comments at script boundaries.
- [x] Add unit tests for start and end comments.
- [x] Document in `docs/LEXER_SPEC.md`.

## 32. Module Block Tokens
- [x] Create `ModuleBlockReader` for `module { }` syntax.
- [x] Support nested module blocks.
- [x] Add token type definitions and tests.
- [x] Document new tokens.

## 33. Decimal Literal Reader
- [x] Implement `DecimalLiteralReader` for `123.45m` or `0d123.45`.
- [x] Add tokens and numeric tests.
- [x] Update documentation for decimal notation.

## 34. Explicit Resource Management
- [x] Tokenize `using` and `await using` constructs.
- [x] Add tests covering top-level and nested usage.
- [x] Document behavior in `docs/LEXER_SPEC.md`.

## 35. Pattern Matching Tokens
- [x] Add `match` and `case` tokens for future pattern matching.
- [x] Add tokenization tests.
- [x] Document reserved keywords.

## 36. Function.sent Meta Property
- [ ] Create `FunctionSentReader` to recognize `function.sent`.
- [ ] Register the reader in default mode for generator functions.
- [ ] Write unit tests covering `function.sent` usage.
- [ ] Document the new token in `docs/LEXER_SPEC.md`.

## 37. Bind Operator
- [ ] Implement `BindOperatorReader` emitting `BIND_OPERATOR` for `::`.
- [ ] Integrate the reader near the pipeline operator in `LexerEngine`.
- [ ] Add tests like `obj::method` tokenization.
- [ ] Document operator semantics.

## 38. RegExp Unicode Sets
- [ ] Extend `RegexOrDivideReader` to parse Unicode sets under the `v` flag.
- [ ] Validate set operations and nested character classes.
- [ ] Add tests using expressions like `[\p{Script=Latin}--[a-z]]/v`.
- [ ] Document support in regex section.

## 39. Flow Type Plugin
- [ ] Provide `FlowTypePlugin` with readers for Flow annotations.
- [ ] Allow enabling Flow mode without interfering with JSX.
- [ ] Document plugin usage and examples.
- [ ] Add unit tests for Flow-specific tokens.

## 40. Byte Order Mark Handling
- [ ] Implement `ByteOrderMarkReader` for files starting with `\uFEFF`.
- [ ] Integrate this reader before ShebangReader in `LexerEngine`.
- [ ] Add tests ensuring BOM is skipped or tokenized correctly.
- [ ] Document BOM behavior in `docs/LEXER_SPEC.md`.

## 41. Source Mapping Comment Reader
- [ ] Create `SourceMappingURLReader` recognizing `//# sourceMappingURL=` comments.
- [ ] Expose parsed mapping values via a new token type.
- [ ] Add unit tests for inline and external source maps.
- [ ] Document usage for build tools.

## 42. Unicode Whitespace Consolidation
- [ ] Extend `WhitespaceReader` to treat all Unicode spaces equivalently.
- [ ] Normalize uncommon spaces like `\u2003` and `\u205F` to a single token type.
- [ ] Add tests covering various Unicode whitespace characters.
- [ ] Describe normalization rules in the spec.

## 43. Error Recovery Mode
- [ ] Add an optional lexer mode to skip malformed or unknown tokens.
- [ ] Emit `ERROR_TOKEN` placeholders for invalid sequences.
- [ ] Ensure recovery mode resumes lexing after errors without crashing.
- [ ] Provide documentation and examples of recovery behavior.
