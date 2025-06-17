// \u00a7 4.6 StringReader
// Parses single and double quoted string literals with escape support.
export function StringReader(stream, factory) {
  const startPos = stream.getPosition();
  const quote = stream.current();
  if (quote !== '"' && quote !== "'") return null;

  let value = quote;
  stream.advance();
  let escaped = false;

  while (!stream.eof()) {
    const ch = stream.current();

    value += ch;
    stream.advance();

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      continue;
    }

    if (ch === quote) {
      const endPos = stream.getPosition();
      return factory('STRING', value, startPos, endPos);
    }

    if (ch === '\n' || ch === '\r') {
      // Unterminated string literal
      stream.setPosition(startPos);
      return null;
    }
  }

  // EOF before closing quote
  stream.setPosition(startPos);
  return null;
}
