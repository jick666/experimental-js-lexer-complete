/**
 * Reads ECMAScript template strings, including `${}` interpolations.
 * Returns a `TEMPLATE_STRING` token containing the raw text of the template.
 */
export function TemplateStringReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  let value = '';

  // consume opening backtick
  value += stream.current();
  stream.advance();

  while (!stream.eof()) {
    let ch = stream.current();

    // handle escapes inside the template
    if (ch === '\\') {
      value += ch;
      stream.advance();
      ch = stream.current();
      if (ch !== null) {
        value += ch;
        stream.advance();
      }
      continue;
    }

    // closing backtick -> end of template literal
    if (ch === '`') {
      value += ch;
      stream.advance();
      const endPos = stream.getPosition();
      return factory('TEMPLATE_STRING', value, startPos, endPos);
    }

    // start of interpolation
    if (ch === '$' && stream.peek() === '{') {
      value += ch;
      stream.advance();
      value += stream.current(); // '{'
      stream.advance();

      let braceCount = 1;
      while (!stream.eof() && braceCount > 0) {
        ch = stream.current();
        if (ch === '\\') {
          value += ch;
          stream.advance();
          if (!stream.eof()) {
            value += stream.current();
            stream.advance();
          }
          continue;
        }
        if (ch === '{') braceCount++;
        if (ch === '}') braceCount--;
        value += ch;
        stream.advance();
        if (braceCount === 0) break;
      }
      continue;
    }

    // regular character within template
    value += ch;
    stream.advance();
  }

  // reached EOF without closing backtick - still return token
  const endPos = stream.getPosition();
  return factory('TEMPLATE_STRING', value, startPos, endPos);
}
