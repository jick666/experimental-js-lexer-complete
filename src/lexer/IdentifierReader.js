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
