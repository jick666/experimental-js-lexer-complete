/**
 * Provides character level access with position tracking for the lexer.
 */
export class CharStream {
  constructor(input) {
    this.input = input;
    this.index = 0;
    this.line = 1;
    this.column = 0;
  }
  current() { return this.input[this.index] || null; }
  peek(offset = 1) { return this.input[this.index + offset] || null; }
  advance() {
    if (this.current() === '\n') { this.line++; this.column = 0; }
    else { this.column++; }
    this.index++;
  }
  eof() { return this.index >= this.input.length; }
  getPosition() { return { line: this.line, column: this.column, index: this.index }; }
  setPosition(pos) {
    this.index = pos.index;
    this.line = pos.line;
    this.column = pos.column;
  }
}
