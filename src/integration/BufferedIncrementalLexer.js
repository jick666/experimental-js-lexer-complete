import { CharStream } from '../lexer/CharStream.js';
import { LexerEngine } from '../lexer/LexerEngine.js';

/**
 * BufferedIncrementalLexer buffers incomplete input across feeds
 * so tokens spanning chunks are produced correctly.
 */
export class BufferedIncrementalLexer {
  constructor({ onToken } = {}) {
    this.onToken = onToken || (() => {});
    this.buffer = '';
    this.tokens = [];
    this.stream = new CharStream('');
    this.engine = new LexerEngine(this.stream);
  }

  feed(chunk) {
    this.buffer += chunk;
    this.stream.input = this.buffer;
    let token;
    let lastIndex = 0;
    while ((token = this.engine.nextToken()) !== null) {
      lastIndex = this.stream.getPosition().index;
      this.tokens.push(token);
      this.onToken(token);
    }
    this.buffer = this.buffer.slice(lastIndex);
    this.stream = new CharStream(this.buffer);
    this.engine = new LexerEngine(this.stream);
  }

  getTokens() {
    return this.tokens.slice();
  }
}
