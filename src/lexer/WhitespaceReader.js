// §4.7 WhitespaceReader
// Consumes consecutive whitespace characters. When `attachTrivia` is true, a
// token of type `WHITESPACE` is created using the provided factory. Otherwise
// the characters are skipped and nothing is returned.
export function WhitespaceReader(stream, factory, attachTrivia = false) {
  let ch = stream.current();
  if (ch === null || !/\s/.test(ch)) return null;

  const start = stream.getPosition();
  let value = '';

  while (ch !== null && /\s/.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const end = stream.getPosition();

  return attachTrivia ? factory('WHITESPACE', value, start, end) : null;
}
