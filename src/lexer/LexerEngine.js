import { IdentifierReader } from './IdentifierReader.js';
import { NumberReader } from './NumberReader.js';
import { OperatorReader } from './OperatorReader.js';
import { PunctuationReader } from './PunctuationReader.js';
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
import { StringReader } from './StringReader.js';
import { JSXReader } from './JSXReader.js';
import { CommentReader } from './CommentReader.js';
import { WhitespaceReader } from './WhitespaceReader.js';
import { Token } from './Token.js';
import { LexerError } from './LexerError.js';
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

/**
 * LexerEngine orchestrates all token readers to produce a stream of Tokens.
 */
export class LexerEngine {
  constructor(stream) {
    this.stream = stream;
    this.stateStack = ['default'];
    // Mapping of mode -> reader list. Order determines priority.
    this.modes = {
      default: [
        CommentReader,
        WhitespaceReader,
        IdentifierReader,
        NumberReader,
        StringReader,
        RegexOrDivideReader,
        OperatorReader,
        PunctuationReader,
        TemplateStringReader,
        JSXReader
      ],
      template_string: [TemplateStringReader],
      regex: [RegexOrDivideReader],
      jsx: [JSXReader]
    };
    // Track last returned token for contextual readers
    this.lastToken = null;
  }

  currentMode() {
    return this.stateStack[this.stateStack.length - 1];
  }

  pushMode(mode) {
    this.stateStack.push(mode);
  }

  popMode() {
    if (this.stateStack.length > 1) {
      this.stateStack.pop();
    }
  }

  /**
   * Reads the next token from the stream, or returns null at EOF.
   */
  nextToken() {
    const { stream } = this;
    const factory = (type, value, start, end) => new Token(type, value, start, end);

      while (!stream.eof()) {
        // 0. Emit comments as tokens
        const comment = CommentReader(stream, factory, this);
        if (comment) {
          this.lastToken = comment;
          return comment;
        }

        // 1. Skip whitespace (handled by WhitespaceReader in default mode)

      let mode = this.currentMode();
      if (mode === 'default' && stream.current() === '<') {
        this.pushMode('jsx');
        mode = this.currentMode();
      }
      const readers = this.modes[mode] || this.modes.default;

      // 2. Try each reader in sequence for the current mode
      for (const Reader of readers) {
        const result = Reader(stream, factory, this);
        if (result) {
          if (result instanceof LexerError) {
            throw result;
          }
          const token = result;
          // 3. Promote identifiers that match keywords
          if (
            token.type === 'IDENTIFIER' &&
            JavaScriptGrammar.keywords.includes(token.value)
          ) {
            token.type = 'KEYWORD';
          }
          this.lastToken = token;
          return token;
        }
      }

      // 4. If nothing matched, advance one character to avoid infinite loops
      stream.advance();
    }

    // End of file
    return null;
  }
}
