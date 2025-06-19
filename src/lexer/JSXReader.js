// §4.10 JSXReader
// Naive JSX element reader. Consumes characters from '<' until matching '>'
// handling quoted attributes. Returns a JSX_TEXT token with the raw contents.
import { LexerError } from './LexerError.js';

export function JSXReader(stream, factory, engine) {
  if (stream.current() !== '<') return null;
  const startPos = stream.getPosition();
  let value = '';
  let depth = 0;
  let braceDepth = 0;
  let quote = null;

  while (!stream.eof()) {
    const ch = stream.current();
    value += ch;

    if (quote) {
      if (ch === '\\') {
        stream.advance();
        if (!stream.eof()) {
          value += stream.current();
          stream.advance();
        }
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      stream.advance();
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      stream.advance();
      continue;
    }

    if (ch === '{') {
      braceDepth++;
      stream.advance();
      continue;
    }
    if (ch === '}') {
      if (braceDepth > 0) braceDepth--;
      stream.advance();
      continue;
    }

    if (braceDepth === 0) {
      if (ch === '<') {
        depth++;
        stream.advance();
        continue;
      }
      if (ch === '/' && stream.peek() === '>') {
        stream.advance();
        value += '>';
        stream.advance();
        depth--;
        if (depth <= 0) {
          const endPos = stream.getPosition();
          engine && engine.popMode && engine.popMode();
          return factory('JSX_TEXT', value, startPos, endPos);
        }
        continue;
      }
      if (ch === '>') {
        depth--;
        stream.advance();
        if (depth <= 0) {
          const endPos = stream.getPosition();
          engine && engine.popMode && engine.popMode();
          return factory('JSX_TEXT', value, startPos, endPos);
        }
        continue;
      }
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
