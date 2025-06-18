// src/lexer/HexReader.js

/**
 * Returns true if ch is a hexadecimal digit (0–9, a–f, A–F).
 */
function isHexDigit(ch) {
  return (
    ch !== null &&
    (
      (ch >= '0' && ch <= '9') ||
      (ch >= 'a' && ch <= 'f') ||
      (ch >= 'A' && ch <= 'F')
    )
  );
}

// HexReader parses hexadecimal literals like 0x1A
export function HexReader(stream, factory) {
  const startPos = stream.getPosition();

  // Must start with '0x' or '0X'
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'x' && prefix !== 'X') return null;

  // Ensure there's at least one hex digit after the prefix
  const next = stream.peek(2);
  if (!isHexDigit(next)) return null;

  // Consume '0' and 'x'/'X'
  let value = '0' + prefix;
  stream.advance(); // consume '0'
  stream.advance(); // consume 'x' or 'X'

  // Read the hex digits
  let ch = stream.current();
  while (isHexDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
