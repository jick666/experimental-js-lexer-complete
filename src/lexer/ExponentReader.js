export function ExponentReader(stream, factory) {
  const startPos = stream.getPosition();
  const slice = stream.input.slice(stream.index);
  const match = /^(\d+(?:\.\d+)?[eE][+-]?\d+)/.exec(slice);
  if (!match) return null;
  const value = match[1];
  for (let i = 0; i < value.length; i++) {
    stream.advance();
  }
  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
