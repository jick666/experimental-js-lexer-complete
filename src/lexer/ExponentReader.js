import { isDigit } from './NumericLiteralUtils.js';

export function ExponentReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  let value = '';
  while (ch !== null && isDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  if (ch === '.') {
    value += ch;
    stream.advance();
    ch = stream.current();
    while (ch !== null && isDigit(ch)) {
      value += ch;
      stream.advance();
      ch = stream.current();
    }
  }

  if (ch !== 'e' && ch !== 'E') {
    stream.setPosition(startPos);
    return null;
  }

  value += ch;
  stream.advance();
  ch = stream.current();

  if (ch === '+' || ch === '-') {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  if (!isDigit(ch)) {
    stream.setPosition(startPos);
    return null;
  }

  while (ch !== null && isDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
