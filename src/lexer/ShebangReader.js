export function ShebangReader(stream, factory) {
  if (stream.index !== 0) return null;
  const startPos = stream.getPosition();
  if (stream.current() !== '#' || stream.peek() !== '!') return null;

  let value = '#!';
  stream.advance();
  stream.advance();

  while (!stream.eof() && stream.current() !== '\n') {
    value += stream.current();
    stream.advance();
  }
  const endPos = stream.getPosition();
  return factory('COMMENT', value, startPos, endPos);
}
