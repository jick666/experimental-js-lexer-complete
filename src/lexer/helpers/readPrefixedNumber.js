export function readPrefixedNumber(stream, factory, prefixChars, isValidDigit) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (!prefix || !prefixChars.includes(prefix)) return null;
  const firstDigit = stream.peek(2);
  if (firstDigit === null || !isValidDigit(firstDigit)) return null;

  let value = '0' + prefix;
  stream.advance(); // consume '0'
  stream.advance(); // consume prefix

  while (stream.current() !== null && isValidDigit(stream.current())) {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
