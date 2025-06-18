export function OctalReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'o' && prefix !== 'O') return null;

  const next = stream.input[stream.index + 2];
  if (next === undefined || next < '0' || next > '7') return null;

  let value = '0' + prefix;
  stream.advance();
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current();
    if (ch < '0' || ch > '7') break;
    value += ch;
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
