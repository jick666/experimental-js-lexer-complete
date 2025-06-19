export function ImportMetaReader(stream, factory) {
  const startPos = stream.getPosition();
  const seq = 'import.meta';
  if (!stream.input.startsWith(seq, startPos.index)) return null;

  const saved = stream.getPosition();
  for (const ch of seq) {
    if (stream.current() !== ch) {
      stream.setPosition(saved);
      return null;
    }
    stream.advance();
  }

  const next = stream.current();
  if (next && /[A-Za-z0-9_$]/.test(next)) {
    stream.setPosition(saved);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('IMPORT_META', seq, startPos, endPos);
}
