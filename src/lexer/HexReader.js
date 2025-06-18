// HexReader parses hexadecimal literals like 0x1A
export function HexReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'x' && prefix !== 'X') return null;
  const next = stream.peek(2);
  if (!isHexDigit(next)) return null;

  // consume prefix
  let value = '0' + prefix;
  stream.advance(); // 0
  stream.advance(); // x/X

  let ch = stream.current();
  while (isHexDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
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
