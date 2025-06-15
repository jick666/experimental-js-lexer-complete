/**
 * TODO(codex): Skip WHITESPACE and attach trivia.
 */
export function WhitespaceReader(stream, factory) {
  let ch = stream.current();
  let consumed = false;
  while (ch !== null && /\s/.test(ch)) {
    consumed = true;
    stream.advance();
    ch = stream.current();
  }
  // This reader does not produce a token itself. If whitespace was consumed,
  // callers may attach trivia to the next token via `factory` if desired.
  return null;
}
