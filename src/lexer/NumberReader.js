// §4.2 NumberReader
import { isDecimalDigit } from './utils.js';

export function NumberReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDecimalDigit(ch)) return null;

  let value = '';
  // integer part
  while (ch !== null && isDecimalDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  // optional decimal
  if (ch === '.') {
    value += '.';
    stream.advance();
    ch = stream.current();
    while (ch !== null && isDecimalDigit(ch)) {
      value += ch;
      stream.advance();
      ch = stream.current();
    }
  }
  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
