// §4.6 TemplateStringReader
// Reads JavaScript template literals enclosed by backticks including
// embedded `${}` expressions. Returns a `TEMPLATE_STRING` token with the
// full raw value or `null` if the stream is not positioned at a backtick.
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
      value += ch;
      stream.advance();
      if (!stream.eof()) {
        value += stream.current();
        stream.advance();
      }
      continue;
    }

    // end of template literal
    if (ch === '`') {
      value += ch;
      stream.advance();
      const endPos = stream.getPosition();
      return factory('TEMPLATE_STRING', value, startPos, endPos);
    }

    // embedded expression `${ ... }`
    if (ch === '$' && stream.peek() === '{') {
      value += '${';
      stream.advance();
      stream.advance();

      // simple brace matching for the expression body
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
        if (c === '{') depth++;
        if (c === '}') depth--;
        value += c;
        stream.advance();
        if (depth === 0) break;
      }
      continue;
    }

    // regular character within template
    value += ch;
    stream.advance();
  }

  // Unterminated template literal – reset position and return null
  if (typeof stream.setPosition === 'function') {
    stream.setPosition(startPos);
  } else {
    stream.index = startPos.index;
    stream.line = startPos.line;
    stream.column = startPos.column;
  }
  return null;
}
