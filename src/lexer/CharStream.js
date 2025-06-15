/**
 * A simple utility class for iterating over a string character by
 * character. Provides helpers to peek ahead, advance the cursor,
 * check for EOF and retrieve the current position.
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
}
