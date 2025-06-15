// §4.5 RegexOrDivideReader
// This reader is context aware. Based on surrounding characters it decides
// whether the current `/` begins a regular expression literal or represents
// the divide operator. It is intentionally heuristic and lightweight.
export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  // Look at the previous non-whitespace character to guess context.
  let i = stream.index - 1;
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

  // Characters that commonly precede a regex literal. If none is found we
  // assume divide operator.
  const regexStarters = new Set([
    '(', '{', '[', '=', ':', ',', ';', '!', '?', '+', '-', '*', '%', '&', '|',
    '^', '~', '<', '>'
  ]);
  const treatAsRegex = prev === null || regexStarters.has(prev);

  if (!treatAsRegex) {
    // Divide or "/=" operator
    stream.advance();
    if (stream.current() === '=') {
      stream.advance();
      const endPos = stream.getPosition();
      return factory('OPERATOR', '/=', startPos, endPos);
    }
    const endPos = stream.getPosition();
    return factory('OPERATOR', '/', startPos, endPos);
  }

  // Parse a regular expression literal of form /pattern/flags
  stream.advance(); // consume opening '/'
  let body = '';
  let ch = stream.current();
  let escaped = false;
  while (ch !== null) {
    if (!escaped && ch === '/') {
      break;
    }
    if (!escaped && ch === '\\') {
      escaped = true;
      body += ch;
      stream.advance();
      ch = stream.current();
      if (ch === null) break;
      body += ch;
      stream.advance();
      escaped = false;
      ch = stream.current();
      continue;
    }
    body += ch;
    escaped = false;
    stream.advance();
    ch = stream.current();
  }

  if (ch !== '/') {
    // Unterminated regex literal -> treat as divide fallback.
    // Reset position and return null so other readers may handle.
    stream.index = startPos.index;
    stream.line = startPos.line;
    stream.column = startPos.column;
    return null;
  }

  stream.advance(); // consume closing '/'
  let flags = '';
  ch = stream.current();
  while (ch !== null && /[a-z]/i.test(ch)) {
    flags += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  const value = `/${body}/${flags}`;
  return factory('REGEX', value, startPos, endPos);
}
