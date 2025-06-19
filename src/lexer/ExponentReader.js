import { isDecimalDigit } from './utils.js';

export function ExponentReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDecimalDigit(ch)) return null;

  let value = '';
  while (ch !== null && isDecimalDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  if (ch === '.') {
    value += ch;
    stream.advance();
    ch = stream.current();
    while (ch !== null && isDecimalDigit(ch)) {
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

  if (!isDecimalDigit(ch)) {
    stream.setPosition(startPos);
    return null;
  }

  while (ch !== null && isDecimalDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
