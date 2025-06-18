export function BigIntReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch < '0' || ch > '9') return null;

  let idx = stream.index;
  while (idx < stream.input.length && stream.input[idx] >= '0' && stream.input[idx] <= '9') {
    idx++;
  }
  if (stream.input[idx] !== 'n') return null;

  let value = '';
  while (stream.current() !== null && stream.current() >= '0' && stream.current() <= '9') {
    value += stream.current();
    stream.advance();
  }

  value += 'n';
  stream.advance();
  const endPos = stream.getPosition();
  return factory('BIGINT', value, startPos, endPos);
}
