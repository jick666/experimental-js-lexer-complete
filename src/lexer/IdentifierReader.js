// §4.1 IdentifierReader
import { isIdentifierStart, isIdentifierPart } from './utils.js';

export function IdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || !isIdentifierStart(ch)) return null;

  let value = '';
  while (ch !== null && isIdentifierPart(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
