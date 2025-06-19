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
  const WS = new Set([' ', '\n', '\t', '\r', '\v', '\f']);
  while (i >= 0) {
    const ch = stream.input[i];
    if (WS.has(ch)) { i--; continue; }
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
  let inCharClass = false;
  while (!stream.eof()) {
    const ch = stream.current();
    if (!escaped) {
      if (ch === '\\') {
        escaped = true;
        body += ch;
        stream.advance();
        continue;
      }

      if (inCharClass) {
        if (ch === ']') inCharClass = false;
      } else {
        if (ch === '[') {
          inCharClass = true;
        } else if (ch === '/') {
          break;
        } else if (
          ch === '('
          && stream.peek() === '?'
          && stream.peek(2) === '<'
        ) {
          body += ch; // '('
          stream.advance();
          body += stream.current(); // '?'
          stream.advance();
          body += stream.current(); // '<'
          stream.advance();
          if (stream.current() === '=' || stream.current() === '!') {
            body += stream.current();
            stream.advance();
          } else {
            while (!stream.eof() && stream.current() !== '>') {
              body += stream.current();
              stream.advance();
            }
            if (stream.current() === '>') {
              body += stream.current();
              stream.advance();
            }
          }
          continue;
        }
      }
    } else {
      escaped = false;
    }

    body += ch;
    stream.advance();
  }

  if (stream.current() !== '/') {
    // Unterminated regex - emit invalid token instead of error
    const endPos = stream.getPosition();
    const value = stream.input.slice(startPos.index, endPos.index);
    return factory('INVALID_REGEX', value, startPos, endPos);
  }

  stream.advance(); // consume closing '/'

  // Collect flags
  let flags = '';
  while (!stream.eof()) {
    const ch = stream.current();
    const code = ch.charCodeAt(0);
    if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) break;
    flags += ch;
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('REGEX', `/${body}/${flags}`, startPos, endPos);
}
