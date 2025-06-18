function isAsciiIdentifierPart(ch) {
  return (
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= 'a' && ch <= 'z') ||
    (ch >= '0' && ch <= '9') ||
    ch === '_'
  );
}

export function UnicodeIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch.charCodeAt(0) < 128) return null;

  let value = '';
  value += ch;
  stream.advance();
  ch = stream.current();

  while (
    ch !== null &&
    (ch.charCodeAt(0) >= 128 || isAsciiIdentifierPart(ch))
  ) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
