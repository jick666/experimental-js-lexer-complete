/**
 * Provides character level access with position tracking for the lexer.
 */
export class CharStream {
  constructor(input) {
    this.input = input;
    this.index = 0;
    this.line = 1;
    this.column = 0;
    this.length = input.length;
    this.currentChar = input[0] || null;
  }
  current() { return this.currentChar; }
  peek(offset = 1) { return this.input[this.index + offset] || null; }
  advance() {
    if (this.currentChar === '\n') { this.line++; this.column = 0; }
    else { this.column++; }
    this.index++;
    this.currentChar = this.input[this.index] || null;
  }
  eof() { return this.index >= this.length; }
  getPosition() { return { line: this.line, column: this.column, index: this.index }; }
  setPosition(pos) {
    this.index = pos.index;
    this.line = pos.line;
    this.column = pos.column;
    this.currentChar = this.input[this.index] || null;
  }
}
