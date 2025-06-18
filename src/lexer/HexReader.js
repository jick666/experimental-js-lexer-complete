export function HexReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'x' && prefix !== 'X') return null;

  let idx = stream.index + 2;
  const ch = stream.input[idx];
  if (!ch || !isHexDigit(ch)) return null;

  let value = '0' + prefix;
  stream.advance();
  stream.advance();

  while (stream.current() !== null && isHexDigit(stream.current())) {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}

function isHexDigit(ch) {
  return (
    ch !== null &&
    ((ch >= '0' && ch <= '9') ||
      (ch >= 'a' && ch <= 'f') ||
      (ch >= 'A' && ch <= 'F'))
  );
}
