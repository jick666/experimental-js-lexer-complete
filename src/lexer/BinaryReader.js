// src/lexer/BinaryReader.js

/**
 * §4.4 BinaryReader
 * Parses binary integer literals like 0b1010 or 0B0101.
 */
export function BinaryReader(stream, factory) {
  const startPos = stream.getPosition();

  // Must start with "0" followed by "b" or "B"
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'b' && prefix !== 'B') return null;

  // Ensure there's at least one binary digit after the prefix
  const next = stream.peek(2);
  if (next === null || (next !== '0' && next !== '1')) {
    // not a valid binary literal
    return null;
  }

  // Consume "0" and "b"/"B"
  let value = '0' + prefix;
  stream.advance(); // consume '0'
  stream.advance(); // consume 'b' or 'B'

  // Consume all following binary digits
  while (stream.current() === '0' || stream.current() === '1') {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
