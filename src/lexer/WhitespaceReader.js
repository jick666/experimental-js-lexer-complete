/**
 * §4.7 WhitespaceReader
 * Consumes consecutive whitespace characters.
 * Does not emit a token; callers may attach trivia if needed.
 */
export function WhitespaceReader(stream, factory) {
  let consumed = false;
  while (!stream.eof() && /\s/.test(stream.current())) {
    consumed = true;
    stream.advance();
  }
  // No token is returned for whitespace.
  return null;
}
