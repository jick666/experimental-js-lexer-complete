// §4.5 RegexOrDivideReader
// Context-sensitive reader: decides whether a “/” starts a RegExp literal or is a divide operator.
export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  // Always treat '/=' as the divide-assign operator, not a regex literal
  if (stream.peek() === '=') {
    stream.advance(); // consume '/'
    stream.advance(); // consume '='
    return factory('OPERATOR', '/=', startPos, stream.getPosition());
  }

  // Look backwards for the last non-whitespace character to guess context
  let i = startPos.index - 1;
  let prev = null;
  while (i >= 0) {
    const ch = stream.input[i];
    if (/\s/.test(ch)) { i--; continue; }
    prev = ch;
    break;
  }

  const regexStarters = new Set([
    '(', '{', '[', '=', ':', ',', ';', '!', '?', '+', '-', '*', '%', '&', '|',
    '^', '~', '<', '>'
  ]);
  const isRegexContext = prev === null || regexStarters.has(prev);

  if (!isRegexContext) {
    // It's a plain divide operator
    stream.advance(); // consume '/'
    return factory('OPERATOR', '/', startPos, stream.getPosition());
  }

  // Parse a regex literal `/pattern/flags`
  stream.advance(); // consume opening '/'

  let body = '';
  let escaped = false;
  while (!stream.eof()) {
    const ch = stream.current();
    if (!escaped && ch === '/') break;
    if (!escaped && ch === '\\') {
      escaped = true;
      body += ch;
      stream.advance();
      continue;
    }
    escaped = false;
    body += ch;
    stream.advance();
  }

  if (stream.current() !== '/') {
    // Unterminated regex — revert and bail
    stream.setPosition(startPos);
    return null;
  }

  stream.advance(); // consume closing '/'

  // Collect flags
  let flags = '';
  while (!stream.eof() && /[a-z]/i.test(stream.current())) {
    flags += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('REGEX', `/${body}/${flags}`, startPos, endPos);
}
