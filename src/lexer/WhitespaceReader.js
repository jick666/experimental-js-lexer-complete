// §4.7 WhitespaceReader
// Consumes contiguous whitespace characters. The reader always returns null but
// invokes the provided factory so callers may capture trivia if desired.
export function WhitespaceReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || !/\s/.test(ch)) return null;

  let value = '';
  while (ch !== null && /\s/.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  if (typeof factory === 'function') {
    // emit trivia token if consumer wants it
    factory('WHITESPACE', value, startPos, endPos);
  }
  return null;
}
