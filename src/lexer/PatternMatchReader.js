export function PatternMatchReader(stream, factory) {
  const startPos = stream.getPosition();
  const prevIndex = startPos.index - 1;
  const prevChar = prevIndex >= 0 ? stream.input[prevIndex] : null;
  if (prevChar && /[A-Za-z0-9_$]/.test(prevChar)) return null;

  function tryWord(word, type) {
    const saved = stream.getPosition();
    let value = '';
    for (const ch of word) {
      if (stream.current() !== ch) {
        stream.setPosition(saved);
        return null;
      }
      value += ch;
      stream.advance();
    }
    const next = stream.current();
    if (next && /[A-Za-z0-9_$]/.test(next)) {
      stream.setPosition(saved);
      return null;
    }
    const endPos = stream.getPosition();
    return factory(type, value, startPos, endPos);
  }

  return (
    tryWord('match', 'MATCH') ||
    tryWord('case', 'CASE')
  );
}
