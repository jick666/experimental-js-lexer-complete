// §4.2 NumberReader
function isDigit(ch) {
  return ch !== null && ch >= '0' && ch <= '9';
}

export function NumberReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  let value = '';
  // integer part
  while (ch !== null && isDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  // optional decimal
  if (ch === '.') {
    value += '.';
    stream.advance();
    ch = stream.current();
    while (ch !== null && isDigit(ch)) {
      value += ch;
      stream.advance();
      ch = stream.current();
    }
  }
  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
