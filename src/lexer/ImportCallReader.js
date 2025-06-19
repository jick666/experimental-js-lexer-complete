export function ImportCallReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!stream.input.startsWith('import(', startPos.index)) return null;

  const saved = stream.getPosition();
  for (const ch of 'import') {
    if (stream.current() !== ch) {
      stream.setPosition(saved);
      return null;
    }
    stream.advance();
  }

  // confirm '(' but don't consume
  if (stream.current() !== '(') {
    stream.setPosition(saved);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('IMPORT_CALL', 'import', startPos, endPos);
}
