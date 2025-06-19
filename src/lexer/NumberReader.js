// §4.2 NumberReader
import { readDigits } from './utils.js';
function isDigit(ch) {
  return ch !== null && ch >= '0' && ch <= '9';
}

export function NumberReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!isDigit(stream.current())) return null;

  let value = readDigits(stream);
  let ch = stream.current();
  if (ch === '.') {
    value += '.';
    stream.advance();
    value += readDigits(stream);
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
