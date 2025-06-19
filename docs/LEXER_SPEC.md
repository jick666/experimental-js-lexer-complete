# Lexer Specification

This document defines the architecture and requirements for the experimental JavaScript lexer.

## 1. CharStream <a name="charstream"></a>
- Provides character-level access  
- Methods: `current()`, `peek(offset)`, `advance()`, `eof()`, `getPosition()`

## 2. Token <a name="token"></a>
- Rich object: `type`, `value`, `start`, `end`, `toJSON()`

## 3. LexerEngine <a name="lexerengine"></a>
- Manages `stateStack`, `lookahead`
- Provides `peek(n)` for token lookahead
- Dispatches to token readers per `stateStack` top

## 4. Token Readers <a name="readers"></a>
Each is a pure function `(stream, factory) => Token|null`:
- `IdentifierReader` (§4.1)
- `NumberReader` (§4.2)
- `HexReader` (§4.3)
- `BigIntReader` (§4.4)
- `OperatorReader` (§4.5)
- `PunctuationReader` (§4.6)
- `RegexOrDivideReader` (§4.7)
- `TemplateStringReader` (§4.8)
- `WhitespaceReader` (§4.9)
- `CommentReader` (§4.10)
- `StringReader` (§4.11)
- `JSXReader` (§4.12)

## 5. Modes <a name="modes"></a>
- `default`, `template_string`, `regex`, `jsx`, etc.

## 6. Token Format <a name="format"></a>
- `type`: `IDENTIFIER`, `NUMBER`, `COMMENT`, …  
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

## 10. Edge Cases & Error Handling <a name="edge"></a>
- Unterminated regex literals yield a `LexerError` of type `UnterminatedRegex`.
- Unterminated template literals yield a `LexerError` of type `UnterminatedTemplate`.
- Bad escape sequences inside template strings produce a `LexerError` of type `BadEscape`.
- Multi-line comments reaching EOF are returned as `COMMENT` tokens without error.
- `/=` is always tokenized as the divide-assign operator before regex detection.
- Regex or divide context is inferred from the last non-whitespace character.
- Character classes inside regex literals are parsed, ignoring `/` characters
  until the closing `]`.
- Named capture groups using the syntax `(?<name>...)` are recognized. Capture
  group names must follow identifier rules (letters, digits, underscore) and
  invalid names cause the lexer to emit an `INVALID_REGEX` token.
- Template strings track nested `${ ... }` braces and handle escapes.
- `HTML_TEMPLATE_STRING` tokens are returned for `html`-tagged templates.
- `NumberReader` only parses base‑10 integers and decimals.
- `BigIntReader` parses integer literals with a trailing `n`.
- `HexReader` parses `0x` or `0X` prefixed hexadecimal integers.
- `OctalReader` parses `0o` or `0O` prefixed octal integers.
- `ExponentReader` parses numbers with `e` or `E` exponents.
- `UnicodeIdentifierReader` reads identifiers starting with non-ASCII Unicode characters.
- `UnicodeEscapeIdentifierReader` reads identifiers containing Unicode escape sequences like `\u{1F600}`.
- `ShebangReader` consumes `#!` headers at the start of a file as `COMMENT` tokens.
- `StringReader` parses single- or double-quoted strings with escapes and errors on unterminated input.
- `JSXReader` tokenizes raw JSX elements between `<` and `>`.
- `JSXReader` ignores `<` inside `{}` expressions and supports self-closing tags.

## 11. Usage Examples <a name="examples"></a>
Run the CLI directly:
```bash
node index.js "let x = 5;" --verbose
```
This prints each token and returns an array like:
`[KEYWORD, IDENTIFIER, OPERATOR, NUMBER, PUNCTUATION]`.

Programmatic usage via the exported `tokenize` function:
```javascript
import { tokenize } from "./index.js";
const tokens = tokenize("const a = /re/g;");
```
`tokens` is an array of `Token` objects. Setting `{ verbose: true }` logs tokens as they are produced. Custom readers may be added by pushing to `LexerEngine.modes.default` before tokenization.

### Streaming Tokens for Syntax Highlighting

The `createTokenStream` helper in `src/integration` returns a Node.js `Readable`
that emits each token object. This is useful for editor integrations that rely
on streaming lexers.

```javascript
import { createTokenStream } from '../index.js';
const stream = createTokenStream('let x = 1;');
stream.on('data', token => {
  console.log(token.type);
});
```

## 12. Plugin API <a name="plugin"></a>
Plugins extend the lexer with additional readers. Register them via
`LexerEngine.registerPlugin` before creating a lexer instance.

```javascript
import { LexerEngine } from './src/lexer/LexerEngine.js';
import { HashPlugin } from './hash-plugin.js';

LexerEngine.registerPlugin(HashPlugin);
```

Plugins may provide readers for any mode using a `modes` map and an optional
`init(engine)` hook. See `docs/PLUGIN_API.md` for a full example.

## 13. Pipeline Operator <a name="pipeline"></a>
The experimental lexer will recognize the pipeline operator `|>` as a distinct `PIPELINE_OPERATOR` token. This reader should emit the token when the `|>` sequence is encountered in default mode. Future versions may support additional pipeline styles.

Example tokenization:

```
a |> b
```

produces the tokens `[IDENTIFIER("a"), PIPELINE_OPERATOR("|>"), IDENTIFIER("b")]`.

## 14. Do Expressions <a name="do-expressions"></a>
Do expressions allow block scoped evaluation returning the last statement value. When the lexer encounters the keyword `do` followed by an opening brace, it emits a `DO_BLOCK_START` token and pushes a `do_block` mode on the state stack. The body of the block is tokenized normally. Each closing brace decrements an internal counter and when the matching brace is reached a `DO_BLOCK_END` token is emitted and the mode is popped. Nested `do` blocks are therefore handled correctly.

Example:

```
do { 1 + 2 }
```

produces the tokens `[DO_BLOCK_START("do {"), NUMBER("1"), OPERATOR("+"), NUMBER("2"), DO_BLOCK_END("}")]`.

## 15. Private Identifiers <a name="private-identifiers"></a>
Private class fields and methods begin with a `#` prefix. When the lexer
encounters `#` followed by an identifier, it emits a `PRIVATE_IDENTIFIER`
token containing the full sequence including the hash.

Example:

```
class C { #field; #method() {} }
```

produces the tokens `[
  KEYWORD("class"), IDENTIFIER("C"), PUNCTUATION("{"),
  PRIVATE_IDENTIFIER("#field"), PUNCTUATION(";"),
  PRIVATE_IDENTIFIER("#method"), PUNCTUATION("("), PUNCTUATION(")"),
  PUNCTUATION("{"), PUNCTUATION("}"), PUNCTUATION("}")
]`.
