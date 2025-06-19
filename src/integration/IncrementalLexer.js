import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { Token } from '../lexer/Token.js';
import { saveState, restoreState } from './stateUtils.js';

/**
 * IncrementalLexer allows feeding code chunks and emits tokens as they are produced.
 */
export class IncrementalLexer {
  constructor({ onToken, errorRecovery = false } = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('');
    this.engine = new LexerEngine(this.stream, { errorRecovery });
    // dependencies for state helpers
    this._deps = { CharStream, LexerEngine, Token };
  }

  /**
   * Feed additional source text to the lexer.
   * @param {string} chunk
   */
  feed(chunk) {
    this.stream.append(chunk);
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

  /**
   * Serialize the lexer's internal state for persistence.
   * @returns {object}
   */
  saveState() {
    return saveState(this);
  }

  /**
   * Restore a previously saved lexer state.
   * @param {object} state
   */
  restoreState(state) {
    restoreState(this, state);
  }
}
