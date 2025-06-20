// §4.1 IdentifierReader

function isIdentifierStart(ch) {
  return (
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= 'a' && ch <= 'z') ||
    ch === '_'
  );
}

function isIdentifierPart(ch) {
  return isIdentifierStart(ch) || (ch >= '0' && ch <= '9');
}

import { TokenReader } from './TokenReader.js';

export class IdentifierTokenReader extends TokenReader {
  read(stream, factory) {
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
}

// Preserve existing functional interface
export function IdentifierReader(stream, factory, engine) {
  const reader = new IdentifierTokenReader();
  return reader.read(stream, factory, engine);
}

// Named export for compatibility
export const IdentifierReaderClass = IdentifierTokenReader;
