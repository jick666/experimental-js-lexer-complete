import { isDigit } from './NumericLiteralUtils.js';

export function DecimalLiteralReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();

  // prefix form 0d123.45
  if (ch === '0' && (stream.peek() === 'd' || stream.peek() === 'D')) {
    // ensure digits after prefix
    const firstDigit = stream.peek(2);
    if (firstDigit === null || !isDigit(firstDigit)) return null;

    let value = '0' + stream.peek();
    stream.advance(); // 0
    stream.advance(); // d or D
    ch = stream.current();
    while (ch !== null && isDigit(ch)) {
      value += ch;
      stream.advance();
      ch = stream.current();
    }
    if (ch === '.') {
      value += '.';
      stream.advance();
      ch = stream.current();
      if (!isDigit(ch)) {
        stream.setPosition(startPos);
        return null;
      }
      while (ch !== null && isDigit(ch)) {
        value += ch;
        stream.advance();
        ch = stream.current();
      }
    }
    const endPos = stream.getPosition();
    return factory('DECIMAL', value, startPos, endPos);
  }

  // suffix form 123.45m or 123m
  if (isDigit(ch)) {
    let value = '';
    while (ch !== null && isDigit(ch)) {
      value += ch;
      stream.advance();
      ch = stream.current();
    }
    if (ch === '.') {
      value += '.';
      stream.advance();
      ch = stream.current();
      if (!isDigit(ch)) {
        stream.setPosition(startPos);
        return null;
      }
      while (ch !== null && isDigit(ch)) {
        value += ch;
        stream.advance();
        ch = stream.current();
      }
    }
    if (ch === 'm' || ch === 'M') {
      value += ch;
      stream.advance();
      const endPos = stream.getPosition();
      return factory('DECIMAL', value, startPos, endPos);
    }
  }

  // not a decimal literal
  stream.setPosition(startPos);
  return null;
}
