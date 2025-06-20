import { readDigits, isDigit } from './utils.js';

export function DecimalLiteralReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();

  // prefix form 0d123.45
  if (ch === '0' && (stream.peek() === 'd' || stream.peek() === 'D')) {
    // ensure digits after prefix
    const firstDigit = stream.peek(2);
    if (!isDigit(firstDigit)) return null;

    let value = '0' + stream.peek();
    stream.advance(); // 0
    stream.advance(); // d or D
    value += readDigits(stream);
    ch = stream.current();
    if (ch === '.') {
      value += '.';
      stream.advance();
      const digits = readDigits(stream);
      if (digits.length === 0) {
        stream.setPosition(startPos);
        return null;
      }
      value += digits;
      ch = stream.current();
    }
    const endPos = stream.getPosition();
    return factory('DECIMAL', value, startPos, endPos);
  }

  // suffix form 123.45m or 123m
  if (isDigit(ch)) {
    let value = readDigits(stream);
    ch = stream.current();
    if (ch === '.') {
      value += '.';
      stream.advance();
      const digits = readDigits(stream);
      if (digits.length === 0) {
        stream.setPosition(startPos);
        return null;
      }
      value += digits;
      ch = stream.current();
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
