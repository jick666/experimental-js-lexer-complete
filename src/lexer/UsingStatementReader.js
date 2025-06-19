export function UsingStatementReader(stream, factory) {
  const startPos = stream.getPosition();
  const prevIndex = startPos.index - 1;
  const prevChar = prevIndex >= 0 ? stream.input[prevIndex] : null;
  if (prevChar && /[A-Za-z0-9_$]/.test(prevChar)) return null;

  // await using
  if (stream.input.startsWith('await', stream.index)) {
    const saved = stream.getPosition();
    let value = '';
    for (const ch of 'await') {
      if (stream.current() !== ch) {
        stream.setPosition(saved);
        return null;
      }
      value += ch;
      stream.advance();
    }
    if (!/\s/.test(stream.current())) {
      stream.setPosition(saved);
      return null;
    }
    while (!stream.eof() && /\s/.test(stream.current())) {
      value += stream.current();
      stream.advance();
    }
    if (!stream.input.startsWith('using', stream.index)) {
      stream.setPosition(saved);
      return null;
    }
    for (const ch of 'using') {
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
    return factory('AWAIT_USING', value, startPos, endPos);
  }

  if (stream.input.startsWith('using', stream.index)) {
    const saved = stream.getPosition();
    let value = '';
    for (const ch of 'using') {
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
    return factory('USING', value, startPos, endPos);
  }

  return null;
}
