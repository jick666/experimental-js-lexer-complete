export function readDigitsWithUnderscores(stream, startPos) {
  let value = '';
  let underscoreSeen = false;
  let lastUnderscore = false;
  let ch = stream.current();
  while (ch !== null && ((ch >= '0' && ch <= '9') || ch === '_')) {
    if (ch === '_') {
      if (lastUnderscore) {
        stream.setPosition(startPos);
        return null;
      }
      underscoreSeen = true;
      lastUnderscore = true;
    } else {
      lastUnderscore = false;
    }
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  return { value, underscoreSeen, lastUnderscore };
}

export function isIdentifierStart(ch) {
  return (
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= 'a' && ch <= 'z') ||
    ch === '_'
  );
}

export function isIdentifierPart(ch) {
  return isIdentifierStart(ch) || (ch >= '0' && ch <= '9');
}
