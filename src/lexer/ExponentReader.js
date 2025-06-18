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

  if (ch === '.') {
    value += ch;
    stream.advance();
    ch = stream.current();
    while (ch !== null && ch >= '0' && ch <= '9') {
      value += ch;
      stream.advance();
      ch = stream.current();
    }
  }

  if (ch !== 'e' && ch !== 'E') {
    stream.setPosition(startPos);
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
    stream.setPosition(startPos);
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
