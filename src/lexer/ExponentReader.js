export function ExponentReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch < '0' || ch > '9') return null;

  let value = '';
  while (ch !== null && ch >= '0' && ch <= '9') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  if (ch !== 'e' && ch !== 'E') {
    // rewind
    stream.index = startPos.index;
    return null;
  }

  value += ch;
  stream.advance();
  ch = stream.current();

  if (ch === '+' || ch === '-') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  if (ch === null || ch < '0' || ch > '9') {
    // invalid exponent
    stream.index = startPos.index;
    return null;
  }

  while (ch !== null && ch >= '0' && ch <= '9') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
