function isHexDigit(ch) {
  return (
    ch !== null &&
    ((ch >= '0' && ch <= '9') ||
      (ch >= 'a' && ch <= 'f') ||
      (ch >= 'A' && ch <= 'F'))
  );
}

export function HexReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0' || (stream.peek() !== 'x' && stream.peek() !== 'X')) {
    return null;
  }

  // consume 0x prefix
  let value = '0';
  stream.advance();
  value += stream.current();
  stream.advance();

  let ch = stream.current();
  if (!isHexDigit(ch)) {
    stream.setPosition(startPos);
    return null;
  }

  while (ch !== null && isHexDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
