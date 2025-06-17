# Lexer Specification

This document defines the architecture and requirements for the experimental JavaScript lexer.

## 1. CharStream <a name="charstream"></a>
- Provides character-level access  
- Methods: `current()`, `peek(offset)`, `advance()`, `eof()`, `getPosition()`

## 2. Token <a name="token"></a>
- Rich object: `type`, `value`, `start`, `end`, `toJSON()`

## 3. LexerEngine <a name="lexerengine"></a>
- Manages `stateStack`, `lookahead`
- Dispatches to token readers per `stateStack` top

## 4. Token Readers <a name="readers"></a>
Each is a pure function `(stream, factory) => Token|null`:
- `IdentifierReader` (§4.1)
- `NumberReader` (§4.2)
- `OperatorReader` (§4.3)
- `PunctuationReader` (§4.4)
- `RegexOrDivideReader` (§4.5)
- `StringReader` (§4.6a)
- `TemplateStringReader` (§4.6)
- `WhitespaceReader` (§4.7)

## 5. Modes <a name="modes"></a>
- `default`, `template_string`, `regex`, `jsx`, etc.

## 6. Token Format <a name="format"></a>
- `type`: `IDENTIFIER`, `NUMBER`, `STRING`, …
- `value`: lexeme  
- `start`/`end`: `{ line, column, index }`  
- `raw`: original text (optional)  
- `trivia`: leading/trailing comments/whitespace  

## 7. Performance Targets <a name="perf"></a>
- Startup < 5 ms (< 1 k lines)  
- Full-file ≤ 100 ms (100 k lines)  
- Support lookahead & incremental lex  

## 8. Testing & CI <a name="ci"></a>
- Unit tests: `tests/readers/*.test.js`  
- Integration tests: `tests/integration.test.js`  
- ESLint rules + JSDoc  
- Jest coverage ≥ 90%  
- GitHub Actions CI  

## 9. Extensibility <a name="ext"></a>
- Grammar definitions: `src/grammar/JavaScriptGrammar.js`  
- Agent prompts: `.codex/promptMap.json`