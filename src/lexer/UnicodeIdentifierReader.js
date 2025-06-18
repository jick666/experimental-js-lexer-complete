const ID_START_RE = /[\p{ID_Start}]/u;
const ID_CONTINUE_RE = /[\p{ID_Continue}]/u;

export function UnicodeIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch.charCodeAt(0) < 128 || !ID_START_RE.test(ch)) {
    return null;
  }

  let value = '';
  while (ch !== null && ID_CONTINUE_RE.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
