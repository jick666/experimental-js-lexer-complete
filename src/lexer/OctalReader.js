export function OctalReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'o' && prefix !== 'O') return null;

  let idx = stream.index + 2;
  const ch = stream.input[idx];
  if (ch === undefined || ch < '0' || ch > '7') return null;

  let value = '0' + prefix;
  stream.advance();
  stream.advance();

  while (
    stream.current() !== null &&
    stream.current() >= '0' &&
    stream.current() <= '7'
  ) {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
