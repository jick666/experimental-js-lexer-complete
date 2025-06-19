// §4.6 TemplateStringReader
// Reads JavaScript template literals enclosed by backticks, including
// embedded `${}` expressions. Returns a TEMPLATE_STRING token with the
// full raw value or null if the stream isn’t at a backtick.
import { LexerError } from './LexerError.js';

export function TemplateStringReader(stream, factory, engine) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  const isHTMLTagged =
    engine &&
    engine.lastToken &&
    engine.lastToken.type === 'IDENTIFIER' &&
    engine.lastToken.value === 'html';

  let value = '';
  // consume opening backtick
  value += '`';
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current();

    // handle escape sequences
    if (ch === '\\') {
      value += ch;
      stream.advance();
      if (stream.eof()) {
        const endPos = stream.getPosition();
        return factory('INVALID_TEMPLATE_STRING', value, startPos, endPos);
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
      return factory(
        isHTMLTagged ? 'HTML_TEMPLATE_STRING' : 'TEMPLATE_STRING',
        value,
        startPos,
        endPos
      );
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
          value += c;
          stream.advance();
          if (!stream.eof()) {
            value += stream.current();
            stream.advance();
          }
          continue;
        }

        if (c === '"' || c === "'") {
          const quote = c;
          value += c;
          stream.advance();
          while (!stream.eof()) {
            const qc = stream.current();
            value += qc;
            stream.advance();
            if (qc === '\\') {
              if (!stream.eof()) {
                value += stream.current();
                stream.advance();
              }
              continue;
            }
            if (qc === quote) break;
          }
          continue;
        }

        if (c === '`') {
          const nested = TemplateStringReader(stream, factory);
          if (nested instanceof LexerError) return nested;
          value += nested.value;
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
