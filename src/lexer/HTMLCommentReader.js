export function HTMLCommentReader(stream, factory) {
  const startPos = stream.getPosition();
  const prevChar = startPos.index > 0 ? stream.input[startPos.index - 1] : null;
  const atLineStart = startPos.index === 0 || prevChar === '\n';
  if (!atLineStart) return null;

  // <!-- comment
  if (
    stream.current() === '<' &&
    stream.peek() === '!' &&
    stream.peek(2) === '-' &&
    stream.peek(3) === '-'
  ) {
    let value = '<!--';
    stream.advance();
    stream.advance();
    stream.advance();
    stream.advance();
    while (!stream.eof() && stream.current() !== '\n') {
      value += stream.current();
      stream.advance();
    }
    const endPos = stream.getPosition();
    return factory('COMMENT', value, startPos, endPos);
  }

  // --> comment
  if (
    stream.current() === '-' &&
    stream.peek() === '-' &&
    stream.peek(2) === '>'
  ) {
    let value = '-->';
    stream.advance();
    stream.advance();
    stream.advance();
    while (!stream.eof() && stream.current() !== '\n') {
      value += stream.current();
      stream.advance();
    }
    const endPos = stream.getPosition();
    return factory('COMMENT', value, startPos, endPos);
  }

  return null;
}
