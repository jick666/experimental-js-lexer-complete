import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';

/**
 * IncrementalLexer allows feeding code chunks and emits tokens as they are produced.
 */
export class IncrementalLexer {
  constructor({ onToken } = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('');
    this.engine = new LexerEngine(this.stream);
  }

  /**
   * Feed additional source text to the lexer.
   * @param {string} chunk
   */
  feed(chunk) {
    this.stream.input += chunk;
    let token;
    while ((token = this.engine.nextToken()) !== null) {
      this.tokens.push(token);
      this.onToken(token);
    }
  }

  /**
   * Return all tokens produced so far.
   */
  getTokens() {
    return this.tokens.slice();
  }
}
