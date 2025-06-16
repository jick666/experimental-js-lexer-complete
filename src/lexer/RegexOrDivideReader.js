// §4.5 RegexOrDivideReader
// Decide between a regular expression literal like `/abc/g`
// or the DIVIDE operator `/` based solely on lookahead.
export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  const rest = stream.input.slice(stream.index);

  // Negative lookahead for comment or /=
  if (rest.startsWith('//') || rest.startsWith('/*') || rest.startsWith('/=')) {
    stream.advance();
    const endPos = stream.getPosition();
    return factory('DIVIDE', '/', startPos, endPos);
  }

  // Try to match a regex literal `/pattern/flags` using a regular expression
  const match = rest.match(/^\/(?:\\.|[^\\\/\n])+\/[a-z]*/);
  if (match) {
    const value = match[0];
    for (let i = 0; i < value.length; i++) stream.advance();
    const endPos = stream.getPosition();
    return factory('REGEX', value, startPos, endPos);
  }

  // Fallback: treat as DIVIDE
  stream.advance();
  const endPos = stream.getPosition();
  return factory('DIVIDE', '/', startPos, endPos);
}
