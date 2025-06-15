/**
 * TODO(codex): Implement LexerEngine using a state machine and readers.
 */
export class LexerEngine {
  constructor(stream) {
    this.stream = stream;
    this.stateStack = ['default'];
    this.lookahead = [];
  }
  nextToken() {
    return null;
  }
}
