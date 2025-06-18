export function UnicodeIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  const slice = stream.input.slice(stream.index);
  const match = /^(\p{ID_Start}\p{ID_Continue}*)/u.exec(slice);
  if (!match) return null;
  const value = match[1];
  for (let i = 0; i < [...value].length; i++) {
    stream.advance();
  }
  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
