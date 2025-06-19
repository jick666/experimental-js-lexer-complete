/**
 * Represents a single lexical token produced by the lexer.
 */
export class Token {
  constructor(type, value, start, end, sourceURL = start.sourceURL || null) {
    this.type = type;
    this.value = value;
    this.start = start;
    this.end = end;
    this.range = [start.index, end.index];
    this.sourceURL = sourceURL;
    this.trivia = { leading: [], trailing: [] };
  }
  toJSON() {
    const obj = {
      type: this.type,
      value: this.value,
      start: this.start,
      end: this.end,
      range: this.range
    };
    if (this.sourceURL) obj.sourceURL = this.sourceURL;
    return obj;
  }
}
