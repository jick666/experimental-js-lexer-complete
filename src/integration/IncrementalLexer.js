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
    let trivia = [];
    while ((token = this.engine.nextToken()) !== null) {
      if (token.type === 'WHITESPACE') {
        trivia.push(token);
        continue;
      }
      token.trivia.leading = trivia;
      if (this.tokens.length > 0) {
        this.tokens[this.tokens.length - 1].trivia.trailing = trivia;
      }
      trivia = [];
      this.tokens.push(token);
      this.onToken(token);
    }
    if (this.tokens.length > 0) {
      this.tokens[this.tokens.length - 1].trivia.trailing = trivia;
    }
  }

  /**
   * Return all tokens produced so far.
   */
  getTokens() {
    return this.tokens.slice();
  }
}
