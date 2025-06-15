/**
 * Represents a single lexical token produced by the lexer. Stores the
 * token type, raw value and positional information. Instances can be
 * serialized via `toJSON()` for test snapshots or debugging tools.
 */
export class Token {
  constructor(type, value, start, end) {
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
  }
  toJSON() {
    return { type: this.type, value: this.value, start: this.start, end: this.end };
  }
}
