const ID_START_RE = /[\p{ID_Start}$_]/u;
const ID_CONTINUE_RE = /[\p{ID_Continue}$_\u200C\u200D]/u;

export function UnicodeIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();

  if (ch === null || ch.charCodeAt(0) < 128 || !ID_START_RE.test(ch)) {
    return null;
  }

  let value = ch;
  stream.advance();
  ch = stream.current();

  while (ch !== null && ID_CONTINUE_RE.test(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
