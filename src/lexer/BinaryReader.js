export function BinaryReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'b' && prefix !== 'B') return null;

  const next = stream.input[stream.index + 2];
  if (next !== '0' && next !== '1') return null;

  let value = '0' + prefix;
  stream.advance();
  stream.advance();

  while (!stream.eof() && (stream.current() === '0' || stream.current() === '1')) {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
