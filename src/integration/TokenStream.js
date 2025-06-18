import { Readable } from 'stream';
import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';

/**
 * Create a Readable stream that emits tokens for syntax highlighting.
 * @param {string} code Source code to tokenize
 * @returns {Readable}
 */
export function createTokenStream(code) {
  const stream = new CharStream(code);
  const engine = new LexerEngine(stream);
  return new Readable({
    objectMode: true,
    read() {
      const tok = engine.nextToken();
      if (tok) {
        this.push(tok);
      } else {
        this.push(null);
      }
    }
  });
}
