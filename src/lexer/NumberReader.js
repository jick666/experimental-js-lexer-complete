// §4.2 NumberReader
import { readDigits, isDigit } from './utils.js';

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
