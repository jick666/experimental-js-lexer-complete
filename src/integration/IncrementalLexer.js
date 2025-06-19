import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';
import { Token } from '../lexer/Token.js';

/**
 * IncrementalLexer allows feeding code chunks and emits tokens as they are produced.
 */
export class IncrementalLexer {
  constructor({ onToken, errorRecovery = false } = {}) {
    this.onToken = onToken || (() => {});
    this.tokens = [];
    this.stream = new CharStream('');
    this.engine = new LexerEngine(this.stream, { errorRecovery });
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
    return {
      input: this.stream.input,
      position: this.stream.getPosition(),
      tokens: this.tokens.map(t => t.toJSON()),
      engine: {
        stateStack: [...this.engine.stateStack],
        buffer: this.engine.buffer.map(t => t.toJSON()),
        disableJsx: this.engine.disableJsx,
        lastToken: this.engine.lastToken ? this.engine.lastToken.toJSON() : null,
        errorRecovery: this.engine.errorRecovery
      }
    };
  }

  /**
   * Restore a previously saved lexer state.
   * @param {object} state
   */
  restoreState(state) {
    this.stream = new CharStream(state.input);
    this.stream.setPosition(state.position);
    this.engine = new LexerEngine(this.stream, { errorRecovery: state.engine.errorRecovery });
    this.engine.stateStack = [...state.engine.stateStack];
    this.engine.buffer = state.engine.buffer.map(
      t => new Token(t.type, t.value, t.start, t.end)
    );
    this.engine.disableJsx = state.engine.disableJsx;
    this.engine.lastToken = state.engine.lastToken
      ? new Token(
          state.engine.lastToken.type,
          state.engine.lastToken.value,
          state.engine.lastToken.start,
          state.engine.lastToken.end
        )
      : null;
    this.tokens = state.tokens.map(
      t => new Token(t.type, t.value, t.start, t.end)
    );
  }
}
