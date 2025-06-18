// §4.6 TemplateStringReader
// Reads JavaScript template literals enclosed by backticks, including
// embedded `${}` expressions. Returns a TEMPLATE_STRING token with the
// full raw value or null if the stream isn’t at a backtick.
import { LexerError } from './LexerError.js';

export function TemplateStringReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  let value = '';
  // consume opening backtick
  value += '`';
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current();

    // handle escape sequences
    if (ch === '\\') {
      const escStart = stream.getPosition();
      value += ch;
      stream.advance();
      if (stream.eof()) {
        return new LexerError(
          'BadEscape',
          'Bad escape sequence in template literal',
          escStart,
          stream.getPosition(),
          stream.input
        );
      }
      value += stream.current();
      stream.advance();
      continue;
    }

    // end of template literal
    if (ch === '`') {
      value += '`';
      stream.advance();
      const endPos = stream.getPosition();
      return factory('TEMPLATE_STRING', value, startPos, endPos);
    }

    // embedded expression `${ ... }`
    if (ch === '$' && stream.peek() === '{') {
      value += '${';
      stream.advance(); // consume '$'
      stream.advance(); // consume '{'

      // match braces within the expression
      let depth = 1;
      while (!stream.eof() && depth > 0) {
        const c = stream.current();
        if (c === '\\') {
          // preserve escaped char inside expression
          value += c;
          stream.advance();
          if (!stream.eof()) {
            value += stream.current();
            stream.advance();
          }
          continue;
        }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        value += c;
        stream.advance();
      }
      continue;
    }

    // regular template content
    value += ch;
    stream.advance();
  }

  // Unterminated literal
  return new LexerError(
    'UnterminatedTemplate',
    'Unterminated template literal',
    startPos,
    stream.getPosition(),
    stream.input
  );
}
