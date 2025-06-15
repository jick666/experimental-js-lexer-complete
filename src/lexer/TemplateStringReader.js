// §4.6 TemplateStringReader
// Reads JavaScript template strings (``), including `${…}` interpolations.
// It doesn’t attempt full parsing of the embedded expressions—just balances braces
// until the matching `}` and closing backtick are found.
export function TemplateStringReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  let value = '';
  // consume opening backtick
  value += stream.current();
  stream.advance();

  while (!stream.eof()) {
    let ch = stream.current();

    // escape sequence (e.g. \`)
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

    // start of interpolation
    if (ch === '$' && stream.peek() === '{') {
      // consume "${"
      value += ch;
      stream.advance();
      value += stream.current();
      stream.advance();

      // balance braces within the interpolation
      let depth = 1;
      while (!stream.eof() && depth > 0) {
        ch = stream.current();

        if (ch === '\\') {
          // handle escaped chars inside interpolation
          value += ch;
          stream.advance();
          if (!stream.eof()) {
            value += stream.current();
            stream.advance();
          }
          continue;
        }

        if (ch === '{') depth++;
        if (ch === '}') depth--;
        value += ch;
        stream.advance();
      }
      continue;
    }

    // any other character
    value += ch;
    stream.advance();
  }

  // EOF reached without closing backtick
  const endPos = stream.getPosition();
  return factory('TEMPLATE_STRING', value, startPos, endPos);
}
