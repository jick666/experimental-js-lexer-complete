// §4.5 RegexOrDivideReader
// Decide between a regular expression literal like `/abc/g`
// or the DIVIDE operator `/` based on lookahead.
export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  let offset = 1;
  let ch = stream.peek(offset);

  // Quick check for cases that cannot be regex: end of file, comment or /=
  if (ch === null || ch === '/' || ch === '*' || ch === '=') {
    stream.advance();
    const endPos = stream.getPosition();
    return factory('DIVIDE', '/', startPos, endPos);
  }

  // Attempt to parse a /pattern/flags sequence
  let pattern = '';
  let escaping = false;
  while ((ch = stream.peek(offset)) !== null) {
    if (!escaping && ch === '/') {
      break; // end of pattern
    }
    pattern += ch;
    if (!escaping && ch === '\\') {
      escaping = true;
    } else {
      escaping = false;
    }
    offset++;
  }

  // If no closing slash found, treat as DIVIDE
  if (ch !== '/') {
    stream.advance();
    const endPos = stream.getPosition();
    return factory('DIVIDE', '/', startPos, endPos);
  }

  // Include closing slash
  offset++;
  let flags = '';
  ch = stream.peek(offset);
  while (ch !== null && /[a-z]/i.test(ch)) {
    flags += ch;
    offset++;
    ch = stream.peek(offset);
  }

  // Consume all characters of the regex literal
  const length = offset;
  for (let i = 0; i < length; i++) stream.advance();
  const endPos = stream.getPosition();
  const value = `/${pattern}/${flags}`;
  return factory('REGEX', value, startPos, endPos);
}
