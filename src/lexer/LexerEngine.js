import { IdentifierReader } from './IdentifierReader.js';
import { HexReader } from './HexReader.js';
import { BinaryReader } from './BinaryReader.js';
import { BigIntReader } from './BigIntReader.js';
import { NumberReader } from './NumberReader.js';
import { StringReader } from './StringReader.js';
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { OperatorReader } from './OperatorReader.js';
import { PunctuationReader } from './PunctuationReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
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
  static plugins = [];

  static registerPlugin(plugin) {
    this.plugins.push(plugin);
  }

  static clearPlugins() {
    this.plugins = [];
  }

  constructor(stream) {
    this.stream = stream;
    this.stateStack = ['default'];

    // Mapping of mode -> reader list. Order determines priority.
    this.modes = {
      default: [
        CommentReader,
        WhitespaceReader,
        IdentifierReader,
        HexReader,
        BinaryReader,
        BigIntReader,
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

    // Apply registered plugins
    for (const plugin of LexerEngine.plugins) {
      if (plugin.modes) {
        for (const [mode, readers] of Object.entries(plugin.modes)) {
          if (!this.modes[mode]) this.modes[mode] = [];
          this.modes[mode].push(...readers);
        }
      }
      if (typeof plugin.init === 'function') {
        plugin.init(this);
      }
    }

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
      // 0. Emit comments
      const comment = CommentReader(stream, factory, this);
      if (comment) {
        this.lastToken = comment;
        return comment;
      }

      // 1. Mode switching for JSX
      let mode = this.currentMode();
      if (mode === 'default' && stream.current() === '<') {
        this.pushMode('jsx');
        mode = this.currentMode();
      }

      const readers = this.modes[mode] || this.modes.default;

      // 2. Try each reader in sequence
      for (const Reader of readers) {
        const result = Reader(stream, factory, this);
        if (result) {
          if (result instanceof LexerError) {
            throw result;
          }
          const token = result;
          // 3. Promote identifiers matching keywords
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

      // 4. No match → advance one char to avoid infinite loop
      stream.advance();
    }

    // EOF
    return null;
  }
}
