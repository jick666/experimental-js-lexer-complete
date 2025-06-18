export function ExponentReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();

  // must start with a digit
  if (ch === null || ch < '0' || ch > '9') return null;

  let value = '';

  // integer part
  while (ch !== null && ch >= '0' && ch <= '9') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  // optional decimal part
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

  // exponent indicator
  if (ch !== 'e' && ch !== 'E') {
    stream.index = startPos.index;
    return null;
  }

  value += ch;
  stream.advance();
  ch = stream.current();

  // optional sign
  if (ch === '+' || ch === '-') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  // must have at least one digit in exponent
  if (ch === null || ch < '0' || ch > '9') {
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
