// §4.5 RegexOrDivideReader
// Context‐sensitive reader: decides whether a “/” starts a RegExp literal or is a divide operator.
export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  // Handle '/=' operator immediately
  if (stream.peek() === '=') {
    stream.advance();
    stream.advance();
    return factory('OPERATOR', '/=', startPos, stream.getPosition());
  }

  // Look backwards for the last non-whitespace character to guess context.
  let i = stream.getPosition().index - 1;
  let prev = null;
  while (i >= 0) {
    const ch = stream.input[i];
    if (/\s/.test(ch)) {
      i--;
      continue;
    }
    prev = ch;
    break;
  }

  // Tokens that typically allow a regex literal to follow:
  const regexStarters = new Set([
    '(', '{', '[', '=', ':', ',', ';', '!', '?', '+', '-', '*', '%', '&', '|',
    '^', '~', '<', '>'
  ]);
  const isRegexContext = prev === null || regexStarters.has(prev);

  if (!isRegexContext) {
    // It's a divide operator (or '/=')
    stream.advance();
    if (stream.current() === '=') {
      stream.advance();
      return factory('OPERATOR', '/=', startPos, stream.getPosition());
    }
    return factory('OPERATOR', '/', startPos, stream.getPosition());
  }

  // Parse a regex literal `/pattern/flags`
  stream.advance(); // consume opening `/`

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
    // Unterminated regex — back out and let another reader handle it
    stream.setPosition(startPos);
    return null;
  }

  stream.advance(); // consume closing `/`

  // Collect flags
  let flags = '';
  while (!stream.eof() && /[a-z]/i.test(stream.current())) {
    flags += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  const value = `/${body}/${flags}`;
  return factory('REGEX', value, startPos, endPos);
}
