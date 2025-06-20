import { readDigits, isDigit } from './utils.js';

export function ExponentReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  let value = readDigits(stream);
  let ch = stream.current();
  
  if (ch === '.') {
    value += ch;
    stream.advance();
    value += readDigits(stream);
    ch = stream.current();
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
  const exponent = readDigits(stream);
  if (exponent.length === 0) {
    stream.setPosition(startPos);
    return null;
  }
  value += exponent;

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
