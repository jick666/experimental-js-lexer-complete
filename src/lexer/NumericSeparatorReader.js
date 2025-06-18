export function NumericSeparatorReader(stream, factory) {
  const startPos = stream.getPosition();
  const slice = stream.input.slice(stream.index);
  const match = /^(\d[\d_]*\d)/.exec(slice);
  if (!match) return null;
  const value = match[1];
  if (!value.includes('_')) return null;
  for (let i = 0; i < value.length; i++) {
    stream.advance();
  }
  const endPos = stream.getPosition();
  return factory('NUMBER', value.replace(/_/g, ''), startPos, endPos);
}
