export function BinaryReader(stream, factory) {
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

  while (!stream.eof()) {
    const c = stream.current();
    if (c !== '0' && c !== '1') break;
    value += c;
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
