export function PrivateIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '#') return null;
  stream.advance();
  let ch = stream.current();
  if (ch === null || !isIdentifierStart(ch)) {
    stream.setPosition(startPos);
    return null;
  }

  let value = '#';
  while (ch !== null && isIdentifierPart(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('PRIVATE_IDENTIFIER', value, startPos, endPos);
}

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
