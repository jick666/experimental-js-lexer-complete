export function NumericSeparatorReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch < '0' || ch > '9') return null;

  let value = '';
  let underscoreSeen = false;
  let lastUnderscore = false;

  while (ch !== null && (ch >= '0' && ch <= '9' || ch === '_')) {
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

  if (!underscoreSeen || lastUnderscore) {
    stream.setPosition(startPos);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
