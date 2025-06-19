export function isDigit(ch) {
  return ch !== null && ch >= '0' && ch <= '9';
}

export function isBinaryDigit(ch) {
  return ch === '0' || ch === '1';
}

export function isOctalDigit(ch) {
  return ch !== null && ch >= '0' && ch <= '7';
}

export function isHexDigit(ch) {
  return (
    ch !== null &&
    ((ch >= '0' && ch <= '9') ||
      (ch >= 'a' && ch <= 'f') ||
      (ch >= 'A' && ch <= 'F'))
  );
}
