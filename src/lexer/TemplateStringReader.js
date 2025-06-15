// §4.6 TemplateStringReader
// Reads template literals delimited by backticks and supporting `${}`
// interpolation. The returned token value includes the surrounding
// backticks and all characters contained within.
export function TemplateStringReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '`') return null;

  let value = '`';
  // consume opening backtick
  stream.advance();

  let ch = stream.current();
  let inExpr = false;
  let braceDepth = 0;

  while (ch !== null) {
    if (!inExpr) {
      if (ch === '`') {
        value += ch;
        stream.advance();
        const endPos = stream.getPosition();
        return factory('TEMPLATE_STRING', value, startPos, endPos);
      }
      if (ch === '\\') {
        value += ch;
        stream.advance();
        ch = stream.current();
        if (ch !== null) {
          value += ch;
          stream.advance();
        }
      } else if (ch === '$' && stream.peek() === '{') {
        value += '${';
        stream.advance();
        stream.advance();
        inExpr = true;
        braceDepth = 1;
      } else {
        value += ch;
        stream.advance();
      }
    } else {
      if (ch === '{') {
        braceDepth++;
      } else if (ch === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          inExpr = false;
        }
      }
      value += ch;
      stream.advance();
    }
    ch = stream.current();
  }

  // EOF reached without closing backtick
  const endPos = stream.getPosition();
  return factory('TEMPLATE_STRING', value, startPos, endPos);
}
