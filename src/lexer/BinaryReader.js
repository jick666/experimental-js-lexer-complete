export function BinaryReader(stream, factory) {
  // simple placeholder that matches 0b or 0B prefix followed by binary digits
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'b' && prefix !== 'B') return null;

  let idx = stream.index + 2;
  const ch = stream.input[idx];
  if (ch !== '0' && ch !== '1') return null;

  let value = '0' + prefix;
  stream.advance();
  stream.advance();

  while (stream.current() === '0' || stream.current() === '1') {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
