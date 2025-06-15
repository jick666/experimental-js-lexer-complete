/**
 * Skips over whitespace characters. Trivia handling is omitted for now.
 */
export function WhitespaceReader(stream) {
  while (!stream.eof() && /\s/.test(stream.current())) {
    stream.advance();
  }
  return null;
}
