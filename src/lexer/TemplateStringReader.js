// §4.6 TemplateStringReader
// Very small implementation that reads JavaScript template strings. It does not
// attempt to fully parse the expressions inside `${}` – it simply scans forward
// until matching braces and the closing backtick are found.
export function TemplateStringReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  let value = '';
  // consume starting backtick
  value += stream.current();
  stream.advance();

  while (!stream.eof()) {
    let ch = stream.current();

    // handle escape sequences
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

    // closing backtick ends the template string
    if (ch === '`') {
      value += ch;
      stream.advance();
      const endPos = stream.getPosition();
      return factory('TEMPLATE_STRING', value, startPos, endPos);
    }

    // embedded expression
    if (ch === '$' && stream.peek() === '{') {
      value += ch;
      stream.advance();
      ch = stream.current(); // '{'
      value += ch;
      stream.advance();

      let depth = 1;
      while (!stream.eof() && depth > 0) {
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
        if (ch === '{') depth++;
        if (ch === '}') depth--;
        value += ch;
        stream.advance();
      }
      continue;
    }

    // regular character inside template
    value += ch;
    stream.advance();
  }

  // EOF reached without closing backtick
  const endPos = stream.getPosition();
  return factory('TEMPLATE_STRING', value, startPos, endPos);
}
