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
- [ ] Document how to save and restore lexer state.
- [ ] Provide example code snippet in `README.md`.
- [ ] Add tests covering lexing resume functionality.
