// §4.10 JSXReader
// Naive JSX element reader. Consumes characters from '<' until matching '>'
// handling quoted attributes. Returns a JSX_TEXT token with the raw contents.
import { LexerError } from './LexerError.js';

export function JSXReader(stream, factory, engine) {
  if (stream.current() !== '<') return null;
  const startPos = stream.getPosition();
  let value = '';
  let depth = 0;

  while (!stream.eof()) {
    const ch = stream.current();
    value += ch;
    if (ch === '<') {
      depth++;
    } else if (ch === '>') {
      depth--;
      stream.advance();
      if (depth <= 0) {
        const endPos = stream.getPosition();
        engine && engine.popMode && engine.popMode();
        return factory('JSX_TEXT', value, startPos, endPos);
      }
      continue;
    } else if (ch === '"' || ch === "'") {
      const quote = ch;
      stream.advance();
      while (!stream.eof()) {
        const qch = stream.current();
        value += qch;
        if (qch === '\\') {
          stream.advance();
          if (!stream.eof()) {
            value += stream.current();
            stream.advance();
          }
          continue;
        }
        if (qch === quote) {
          stream.advance();
          break;
        }
        stream.advance();
      }
      continue;
    }
    stream.advance();
  }

  return new LexerError(
    'UnterminatedJSX',
    'Unterminated JSX element',
    startPos,
    stream.getPosition(),
    stream.input
  );
}
