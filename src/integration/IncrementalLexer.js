import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { Token } from '../lexer/Token.js';
import { saveState, restoreState } from './stateUtils.js';
import { tokenIterator } from './tokenUtils.js';

/**
 * IncrementalLexer allows feeding code chunks and emits tokens as they are produced.
 */
export class IncrementalLexer {
  constructor({ onToken, errorRecovery = false, sourceURL = null } = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('', { sourceURL });
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
    for (const token of tokenIterator(this.engine)) {
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
