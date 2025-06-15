// §4.5 RegexOrDivideReader
// Decides whether a forward slash begins a regular expression literal or
// represents the divide operator. The heuristic here is intentionally simple:
// if the preceding non-whitespace character looks like it can end an
// expression (identifier, number, closing paren/bracket/brace, etc.) then the
// slash is treated as the divide operator. Otherwise it starts a regex literal.
export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  // Look behind for the previous non-whitespace character
  const input = stream.input;
  let idx = stream.index - 1;
  while (idx >= 0 && /\s/.test(input[idx])) idx--;
  const prev = idx >= 0 ? input[idx] : null;

  // Divide assignment '/=' always treated as operator
  if (stream.peek() === '=') {
    stream.advance();
    stream.advance();
    const endPos = stream.getPosition();
    return factory('OPERATOR', '/=', startPos, endPos);
  }

  const divideContext =
    prev !== null && /[\w)\]\}"']/.test(prev);

  if (divideContext) {
    stream.advance();
    const endPos = stream.getPosition();
    return factory('OPERATOR', '/', startPos, endPos);
  }

  // Parse a regex literal: /pattern/flags
  stream.advance(); // skip opening slash
  let pattern = '';
  let ch = stream.current();
  while (ch !== null) {
    if (ch === '\\') {
      pattern += ch;
      stream.advance();
      ch = stream.current();
      if (ch === null) break;
      pattern += ch;
      stream.advance();
    } else if (ch === '/') {
      break;
    } else {
      pattern += ch;
      stream.advance();
    }
    ch = stream.current();
  }

  if (stream.current() !== '/') {
    return null;
  }

  stream.advance(); // consume closing slash
  let flags = '';
  ch = stream.current();
  while (ch !== null && /[a-z]/i.test(ch)) {
    flags += ch;
    stream.advance();
    ch = stream.current();
  }

  const endPos = stream.getPosition();
  return factory('REGEX', `/${pattern}/${flags}`, startPos, endPos);
}
