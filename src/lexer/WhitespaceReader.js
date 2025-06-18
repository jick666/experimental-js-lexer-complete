/**
 * §4.7 WhitespaceReader
 * Consumes consecutive whitespace characters.
 * Does not emit a token; callers may attach trivia if needed.
 */
const WHITESPACE = new Set([' ', '\n', '\t', '\r', '\v', '\f']);

export function WhitespaceReader(stream) {
  while (!stream.eof() && WHITESPACE.has(stream.current())) {
    stream.advance();
  }
  // No token is returned for whitespace.
  return null;
}
