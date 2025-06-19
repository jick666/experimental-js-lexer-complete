/**
 * §4.7 WhitespaceReader
 * Consumes consecutive whitespace characters and returns a WHITESPACE token.
 */
const WHITESPACE = new Set([' ', '\n', '\t', '\r', '\v', '\f']);

export function WhitespaceReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!WHITESPACE.has(stream.current())) return null;

  let value = '';
  while (!stream.eof() && WHITESPACE.has(stream.current())) {
    value += stream.current();
    stream.advance();
  }
  const endPos = stream.getPosition();
  return factory('WHITESPACE', value, startPos, endPos);
}
