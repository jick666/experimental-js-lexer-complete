import { Readable } from 'stream';
import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { tokenIterator } from './tokenUtils.js';

/**
 * Create a Readable stream that emits tokens for syntax highlighting.
 * @param {string} code Source code to tokenize
 * @returns {Readable}
 */
export function createTokenStream(code, { errorRecovery = false } = {}) {
  const stream = new CharStream(code);
  const engine = new LexerEngine(stream, { errorRecovery });
  const iter = tokenIterator(engine);
  return new Readable({
    objectMode: true,
    read() {
      const { value, done } = iter.next();
      if (done) {
        this.push(null);
        return;
      }
      this.push(value);
    }
  });
}
