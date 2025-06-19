export function createRadixReader(prefixChars, isDigit) {
  return function(stream, factory) {
    const startPos = stream.getPosition();
    if (stream.current() !== '0') return null;
    const prefix = stream.peek();
    if (!prefixChars.includes(prefix)) return null;
    const next = stream.peek(2);
    if (next === null || !isDigit(next)) return null;

    let value = '0' + prefix;
    stream.advance();
    stream.advance();

    while (stream.current() !== null && isDigit(stream.current())) {
      value += stream.current();
      stream.advance();
    }

    const endPos = stream.getPosition();
    return factory('NUMBER', value, startPos, endPos);
  };
}

export function isHexDigit(ch) {
  return (
    ch !== null &&
    ((ch >= '0' && ch <= '9') ||
      (ch >= 'a' && ch <= 'f') ||
      (ch >= 'A' && ch <= 'F'))
  );
}
