export function NumericSeparatorReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch < '0' || ch > '9') return null;

  let value = '';
  let lastUnderscore = false;
  while (ch !== null) {
    if (ch === '_') {
      if (lastUnderscore) {
        stream.setPosition(startPos);
        return null;
      }
      lastUnderscore = true;
      value += ch;
    } else if (ch >= '0' && ch <= '9') {
      lastUnderscore = false;
      value += ch;
    } else {
      break;
    }
    stream.advance();
    ch = stream.current();
  }

  if (value.includes('_')) {
    const endPos = stream.getPosition();
    return factory('NUMBER', value, startPos, endPos);
  }

  stream.setPosition(startPos);
  return null;
}
