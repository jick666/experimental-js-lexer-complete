/**
 * TODO(codex): Implement Token class.
 * - constructor: type, value, start, end
 * - toJSON(): serialize token
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
