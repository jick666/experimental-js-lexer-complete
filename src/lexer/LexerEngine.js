// Individual token readers
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
import { JSXReader } from './JSXReader.js';
import { CommentReader } from './CommentReader.js';
import { HTMLCommentReader } from './HTMLCommentReader.js';
import { SourceMappingURLReader } from './SourceMappingURLReader.js';
// Consolidated list of default readers
import { baseReaders } from './defaultReaders.js';
import { Token } from './Token.js';
import { LexerError } from './LexerError.js';
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';
import { runReader } from './TokenReader.js';

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

  constructor(stream, { errorRecovery = false } = {}) {
    this.stream = stream;
    this.errorRecovery = errorRecovery;
    this.stateStack = ['default'];
    this.buffer = [];
    this.disableJsx = false;
    this.triviaReaders = [HTMLCommentReader, SourceMappingURLReader, CommentReader];

    // Mapping of mode -> reader list. Order determines priority.
    const shared = [...baseReaders];
    this.modes = {
      default: [...shared],
      do_block: [...shared],
      module_block: [...shared],
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
   * Run trivia readers (comments and source mappings) and return a token if any
   * matches.
   * @param {Function} factory
   * @returns {Token|null}
   */
  _readTrivia(factory) {
    const { stream, triviaReaders } = this;
    for (const Reader of triviaReaders) {
      const tok = runReader(Reader, stream, factory, this);
      if (tok) return tok;
    }
    return null;
  }

  /**
   * Internal method that reads the next token directly from the stream.
   * @returns {Token|null}
   */
  _readFromStream() {
    const { stream } = this;
    const factory = (type, value, start, end) =>
      new Token(type, value, start, end, stream.sourceURL);

    while (!stream.eof()) {
      // 0. Emit comments and other trivia
      const trivia = this._readTrivia(factory);
      if (trivia) {
        this.lastToken = trivia;
        return trivia;
      }

      // 1. Mode switching for JSX
      let mode = this.currentMode();
      if (mode === 'default' && !this.disableJsx && stream.current() === '<') {
        const next = stream.peek();
        if (/[A-Za-z/!?]|>/.test(next)) {
          this.pushMode('jsx');
          mode = this.currentMode();
        }
      }

      const readers = this.modes[mode] || this.modes.default;

      // 2. Try each reader in sequence
      for (const Reader of readers) {
        const result = runReader(Reader, stream, factory, this);
        if (result) {
          if (result instanceof LexerError) {
            if (this.errorRecovery) {
              let endPos = result.end;
              stream.setPosition(endPos);
              if (endPos.index === result.start.index) {
                stream.advance();
                endPos = stream.getPosition();
              }
              const value = stream.input.slice(result.start.index, endPos.index);
              const tok = factory('ERROR_TOKEN', value, result.start, endPos);
              this.lastToken = tok;
              return tok;
            }
            throw result;
          }
          const token = result;
          // 3. Promote identifiers matching keywords
          if (
            token.type === 'IDENTIFIER' &&
            JavaScriptGrammar.keywordSet.has(token.value)
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

  /**
   * Get the next token, consuming it from the stream or lookahead buffer.
   * @returns {Token|null}
   */
  nextToken() {
    if (this.buffer.length > 0) {
      const tok = this.buffer.shift();
      this.lastToken = tok;
      return tok;
    }
    const tok = this._readFromStream();
    this.lastToken = tok;
    return tok;
  }

  /**
   * Peek ahead n tokens without consuming them.
   * @param {number} [n=1]
   * @returns {Token|null}
   */
  peek(n = 1) {
    while (this.buffer.length < n) {
      const tok = this._readFromStream();
      if (tok === null) break;
      this.buffer.push(tok);
    }
    return this.buffer[n - 1] || null;
  }
}
