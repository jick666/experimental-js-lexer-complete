// §4.8 CommentReader
// Detects single-line (//) and multi-line (/* */) comments and returns
// a COMMENT token with the comment text. Newlines terminating single-line
// comments are not consumed.
export function CommentReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;
  const next = stream.peek();

  if (next === '/') {
    let value = '//';
    stream.advance();
    stream.advance();
    while (!stream.eof() && stream.current() !== '\n') {
      value += stream.current();
      stream.advance();
    }
    const endPos = stream.getPosition();
    return factory('COMMENT', value, startPos, endPos);
  }

  if (next === '*') {
    let value = '/*';
    stream.advance();
    stream.advance();
    while (!stream.eof()) {
      const ch = stream.current();
      if (ch === '*' && stream.peek() === '/') {
        value += '*';
        stream.advance();
        value += '/';
        stream.advance();
        const endPos = stream.getPosition();
        return factory('COMMENT', value, startPos, endPos);
      }
      value += ch;
      stream.advance();
    }
    // reached EOF without closing */
    const endPos = stream.getPosition();
    return factory('COMMENT', value, startPos, endPos);
  }

  return null;
}
