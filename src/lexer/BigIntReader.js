export function BigIntReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (ch === null || ch < '0' || ch > '9') return null;

  // verify there is a trailing 'n' so this is really a bigint
  let idx = stream.index;
  while (idx < stream.input.length && /[0-9_]/.test(stream.input[idx])) {
    idx++;
  }
  if (stream.input[idx] !== 'n') return null;

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

  if (lastUnderscore) {
    stream.setPosition(startPos);
    return null;
  }

  if (underscoreSeen && value.startsWith('_')) {
    stream.setPosition(startPos);
    return null;
  }

  if (ch !== 'n') {
    stream.setPosition(startPos);
    return null;
  }

  value += 'n';
  stream.advance();
  const endPos = stream.getPosition();
  return factory('BIGINT', value, startPos, endPos);
}
