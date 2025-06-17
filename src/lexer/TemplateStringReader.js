// §4.6 TemplateStringReader
// Parses template string literals delimited by backticks, including
// interpolated expressions in `${}`. Returns a TEMPLATE_STRING token
// containing the full template literal text.

export function TemplateStringReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  let value = '';
  let inExpr = false;
  let braceDepth = 0;

  // consume opening backtick
  value += stream.current();
  stream.advance();

  while (!stream.eof()) {
    const ch = stream.current();
    value += ch;

    if (inExpr) {
      if (ch === '{') {
        braceDepth++;
      } else if (ch === '}') {
        if (braceDepth === 0) {
          inExpr = false;
        } else {
          braceDepth--;
        }
      }
    } else {
      if (ch === '\\') {
        // escape next character
        stream.advance();
        if (!stream.eof()) {
          value += stream.current();
        }
      } else if (ch === '$' && stream.peek() === '{') {
        inExpr = true;
        braceDepth = 0;
        stream.advance();
        value += stream.current(); // include '{'
      } else if (ch === '`') {
        stream.advance();
        const endPos = stream.getPosition();
        return factory('TEMPLATE_STRING', value, startPos, endPos);
      }
    }
    stream.advance();
  }

  // Unterminated template string
  stream.setPosition(startPos);
  return null;
}
