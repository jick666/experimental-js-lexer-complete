/**
 * Represents a single lexical token produced by the lexer.
 */
export class Token {
  constructor(type, value, start, end) {
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
    this.trivia = { leading: [], trailing: [] };
  }
  toJSON() {
    return { type: this.type, value: this.value, start: this.start, end: this.end };
  }
}
