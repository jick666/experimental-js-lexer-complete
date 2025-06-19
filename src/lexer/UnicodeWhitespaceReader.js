const WS_RE = /\p{White_Space}/u;

export function UnicodeWhitespaceReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!WS_RE.test(stream.current() || '')) return null;
  let value = '';
  while (!stream.eof() && WS_RE.test(stream.current())) {
    value += stream.current();
    stream.advance();
  }
  const endPos = stream.getPosition();
  return factory('WHITESPACE', value, startPos, endPos);
}
