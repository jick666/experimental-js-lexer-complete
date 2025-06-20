export function isDigit(ch) {
  return ch !== null && ch >= '0' && ch <= '9';
}

export function readDigitsWithUnderscores(stream, startPos) {
  let value = '';
  let underscoreSeen = false;
  let lastUnderscore = false;
  let ch = stream.current();
  while (ch !== null && (isDigit(ch) || ch === '_')) {
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

export function readDigits(stream) {
  let value = '';
  let ch = stream.current();
  while (isDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  return value;
}
