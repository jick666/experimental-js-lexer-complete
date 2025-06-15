// §4.1 IdentifierReader
import { patterns } from '../grammar/JavaScriptGrammar.js';

export function IdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!/[A-Za-z_]/.test(ch)) return null;

  let value = '';
  while (ch !== null && /[A-Za-z0-9_]/.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
