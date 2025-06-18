# Task Breakdown for Remaining TODO Items

This document outlines detailed subtasks for each remaining objective in `TODO_CHECKLIST.md`.

## 12. Extended Reader Support
- [ ] Implement a `JSXReader` capable of tokenizing JSX syntax.
- [ ] Add a `jsx` mode in `LexerEngine` and dispatch to `JSXReader`.
- [ ] Support advanced string literals (multi-line, escape forms) in a dedicated reader.
- [ ] Update unit tests covering JSX and new string literals.
- [ ] Document usage and edge cases in `docs/LEXER_SPEC.md`.

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
