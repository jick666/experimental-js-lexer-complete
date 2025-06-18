export function UnicodeIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  const ch = stream.current();
  if (ch === null || ch.charCodeAt(0) < 128) return null;

  let value = '';
  while (stream.current() !== null && stream.current().charCodeAt(0) >= 128) {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
