import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { LexerError } from '../lexer/LexerError.js';

/**
 * BufferedIncrementalLexer buffers incomplete tokens across feed() calls.
 * It avoids throwing when a chunk ends in the middle of a token.
 */
export class BufferedIncrementalLexer {
  constructor({ onToken } = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('');
    this.engine = new LexerEngine(this.stream);
    this.trivia = [];
  }

  /**
   * Feed additional source text to the lexer.
   * Incomplete trailing tokens are buffered until completed.
   * @param {string} chunk
   */
  feed(chunk) {
    this.stream.append(chunk);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const pos = this.stream.getPosition();
      let token = null;
      try {
        token = this.engine.nextToken();
      } catch (err) {
        if (err instanceof LexerError && err.end.index >= this.stream.input.length) {
          // Incomplete token at end of input, rewind and wait for more data
          this.stream.setPosition(pos);
          break;
        }
        throw err;
      }
      if (token === null) break;
      if (
        token.type === 'COMMENT' &&
        token.value.startsWith('/*') &&
        !token.value.endsWith('*/') &&
        this.stream.eof()
      ) {
        // Incomplete multi-line comment, rewind and wait for more input
        this.stream.setPosition(pos);
        break;
      }
      if (token.type === 'WHITESPACE') {
        this.trivia.push(token);
        continue;
      }
      token.trivia.leading = this.trivia;
      if (this.tokens.length > 0) {
        this.tokens[this.tokens.length - 1].trivia.trailing = this.trivia;
      }
      this.trivia = [];
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
