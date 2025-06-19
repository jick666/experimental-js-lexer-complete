// §4.9 StringReader
// Reads quoted strings using single or double quotes. Supports escapes and returns
// a STRING token or a LexerError on unterminated input.
import { LexerError } from './LexerError.js';

export function StringReader(stream, factory) {
  const quote = stream.current();
  if (quote !== '"' && quote !== "'") return null;
  const startPos = stream.getPosition();
  let value = '';
  value += quote;
  stream.advance();
  while (!stream.eof()) {
    const ch = stream.current();
    if (ch === '\\') {
      value += ch;
      stream.advance();
      if (stream.eof()) {
        const endPos = stream.getPosition();
        return factory(
          'INVALID_ESCAPE',
          stream.input.slice(startPos.index, endPos.index),
          startPos,
          endPos
        );
      }
      value += stream.current();
      stream.advance();
      continue;
    }
    if (ch === quote) {
      value += quote;
      stream.advance();
      const endPos = stream.getPosition();
      return factory('STRING', value, startPos, endPos);
    }
    if (ch === '\n' || ch === '\r') {
      return new LexerError(
        'UnterminatedString',
        'Unterminated string literal',
        startPos,
        stream.getPosition(),
        stream.input
      );
    }
    value += ch;
    stream.advance();
  }
  return new LexerError(
    'UnterminatedString',
    'Unterminated string literal',
    startPos,
    stream.getPosition(),
    stream.input
  );
}
