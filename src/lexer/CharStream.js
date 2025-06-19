/**
 * Provides character level access with position tracking for the lexer.
 */
export class CharStream {
  constructor(input, { sourceURL = null } = {}) {
    this.input = input;
    this.length = input.length;
    this.index = 0;
    this.line = 1;
    this.column = 0;
    this.sourceURL = sourceURL;
  }

  append(chunk) {
    this.input += chunk;
    this.length = this.input.length;
  }

  current() {
    return this.index < this.length ? this.input[this.index] || null : null;
  }

  peek(offset = 1) {
    const pos = this.index + offset;
    return pos < this.length ? this.input[pos] || null : null;
  }

  advance() {
    if (this.current() === '\n') {
      this.line++;
      this.column = 0;
    } else {
      this.column++;
    }
    this.index++;
  }

  eof() {
    return this.index >= this.length;
  }

  getPosition() {
    return {
      line: this.line,
      column: this.column,
      index: this.index,
      sourceURL: this.sourceURL
    };
  }

  setPosition(pos) {
    this.index = pos.index;
    this.line = pos.line;
    this.column = pos.column;
  }
}
