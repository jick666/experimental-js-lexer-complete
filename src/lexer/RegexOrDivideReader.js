// §4.5 RegexOrDivideReader
// Context-sensitive reader: decides whether a “/” starts a RegExp literal or is a divide operator.
import { LexerError } from './LexerError.js';

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
  let inClass = false;
  while (!stream.eof()) {
    const ch = stream.current();
    if (!escaped) {
      if (ch === '\\') {
        escaped = true;
        body += ch;
        stream.advance();
        continue;
      }
      if (ch === '[' && !inClass) {
        inClass = true;
        body += ch;
        stream.advance();
        continue;
      }
      if (ch === ']' && inClass) {
        inClass = false;
        body += ch;
        stream.advance();
        continue;
      }
      if (ch === '/' && !inClass) break;
    } else {
      escaped = false;
    }
    body += ch;
    stream.advance();
  }

  if (stream.current() !== '/') {
    // Unterminated regex
    return new LexerError(
      'UnterminatedRegex',
      'Unterminated regular expression literal',
      startPos,
      stream.getPosition(),
      stream.input
    );
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
