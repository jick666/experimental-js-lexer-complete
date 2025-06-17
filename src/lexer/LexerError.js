export class LexerError extends Error {
  constructor(type, message, start, end) {
    super(message);
    this.name = 'LexerError';
    this.type = type;
    this.start = start;
    this.end = end;
  }

  toJSON() {
    return { type: this.type, message: this.message, start: this.start, end: this.end };
  }
}

