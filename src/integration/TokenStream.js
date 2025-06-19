import { Readable } from 'stream';
import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';

/**
 * Create a Readable stream that emits tokens for syntax highlighting.
 * @param {string} code Source code to tokenize
 * @returns {Readable}
 */
export function createTokenStream(code, { errorRecovery = false } = {}) {
  const stream = new CharStream(code);
  const engine = new LexerEngine(stream, { errorRecovery });
  let trivia = [];
  let prev = null;
  return new Readable({
    objectMode: true,
    read() {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const tok = engine.nextToken();
        if (!tok) {
          if (prev) prev.trivia.trailing = trivia;
          this.push(null);
          return;
        }
        if (tok.type === 'WHITESPACE') {
          trivia.push(tok);
          continue;
        }
        tok.trivia.leading = trivia;
        if (prev) prev.trivia.trailing = trivia;
        trivia = [];
        prev = tok;
        this.push(tok);
        break;
      }
    }
  });
}
