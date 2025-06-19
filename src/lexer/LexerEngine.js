import { IdentifierReader } from './IdentifierReader.js';
import { BinaryReader } from './BinaryReader.js';
import { OctalReader } from './OctalReader.js';
import { HexReader } from './HexReader.js';
import { BigIntReader } from './BigIntReader.js';
import { DecimalLiteralReader } from './DecimalLiteralReader.js';
import { NumericSeparatorReader } from './NumericSeparatorReader.js';
import { ExponentReader } from './ExponentReader.js';
import { NumberReader } from './NumberReader.js';
import { StringReader } from './StringReader.js';
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { BindOperatorReader } from './BindOperatorReader.js';
import { PipelineOperatorReader } from './PipelineOperatorReader.js';
import { OperatorReader } from './OperatorReader.js';
import { PunctuationReader } from './PunctuationReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
import { JSXReader } from './JSXReader.js';
import { CommentReader } from './CommentReader.js';
import { HTMLCommentReader } from './HTMLCommentReader.js';
import { SourceMappingURLReader } from './SourceMappingURLReader.js';
import { UnicodeWhitespaceReader } from './UnicodeWhitespaceReader.js';
import { ByteOrderMarkReader } from './ByteOrderMarkReader.js';
import { UnicodeIdentifierReader } from './UnicodeIdentifierReader.js';
import { UnicodeEscapeIdentifierReader } from './UnicodeEscapeIdentifierReader.js';
import { ShebangReader } from './ShebangReader.js';
import { DoExpressionReader } from './DoExpressionReader.js';
import { ModuleBlockReader } from './ModuleBlockReader.js';
import { UsingStatementReader } from './UsingStatementReader.js';
import { PatternMatchReader } from './PatternMatchReader.js';
import { PrivateIdentifierReader } from './PrivateIdentifierReader.js';
import { ImportAssertionReader } from './ImportAssertionReader.js';
import { RecordAndTupleReader } from './RecordAndTupleReader.js';
import { FunctionSentReader } from './FunctionSentReader.js';
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
    this.buffer = [];
    this.disableJsx = false;

    // Mapping of mode -> reader list. Order determines priority.
    this.modes = {
      default: [
        HTMLCommentReader,
        SourceMappingURLReader,
        CommentReader,
        UnicodeWhitespaceReader,
        ByteOrderMarkReader,
        ShebangReader,
        PrivateIdentifierReader,
        DoExpressionReader,
        ModuleBlockReader,
        UsingStatementReader,
        PatternMatchReader,
        FunctionSentReader,
        ImportAssertionReader,
        RecordAndTupleReader,
        IdentifierReader,
        UnicodeIdentifierReader,
        UnicodeEscapeIdentifierReader,
        HexReader,
        BinaryReader,
        OctalReader,
        BigIntReader,
        DecimalLiteralReader,
        NumericSeparatorReader,
        ExponentReader,
        NumberReader,
        StringReader,
        RegexOrDivideReader,
        PipelineOperatorReader,
        BindOperatorReader,
        OperatorReader,
        PunctuationReader,
        TemplateStringReader,
        JSXReader
      ],
      do_block: [
        HTMLCommentReader,
        SourceMappingURLReader,
        CommentReader,
        UnicodeWhitespaceReader,
        ByteOrderMarkReader,
        ShebangReader,
        PrivateIdentifierReader,
        DoExpressionReader,
        ModuleBlockReader,
        UsingStatementReader,
        PatternMatchReader,
        FunctionSentReader,
        ImportAssertionReader,
        RecordAndTupleReader,
        IdentifierReader,
        UnicodeIdentifierReader,
        UnicodeEscapeIdentifierReader,
        HexReader,
        BinaryReader,
        OctalReader,
        BigIntReader,
        DecimalLiteralReader,
        NumericSeparatorReader,
        ExponentReader,
        NumberReader,
        StringReader,
        RegexOrDivideReader,
        PipelineOperatorReader,
        BindOperatorReader,
        OperatorReader,
        PunctuationReader,
        TemplateStringReader,
        JSXReader
      ],
      module_block: [
        HTMLCommentReader,
        SourceMappingURLReader,
        CommentReader,
        UnicodeWhitespaceReader,
        ByteOrderMarkReader,
        ShebangReader,
        PrivateIdentifierReader,
        DoExpressionReader,
        ModuleBlockReader,
        UsingStatementReader,
        PatternMatchReader,
        FunctionSentReader,
        ImportAssertionReader,
        RecordAndTupleReader,
        IdentifierReader,
        UnicodeIdentifierReader,
        UnicodeEscapeIdentifierReader,
        HexReader,
        BinaryReader,
        OctalReader,
        BigIntReader,
        DecimalLiteralReader,
        NumericSeparatorReader,
        ExponentReader,
        NumberReader,
        StringReader,
        RegexOrDivideReader,
        PipelineOperatorReader,
        BindOperatorReader,
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
   * Internal method that reads the next token directly from the stream.
   * @returns {Token|null}
   */
  _readFromStream() {
    const { stream } = this;
    const factory = (type, value, start, end) => new Token(type, value, start, end);

    while (!stream.eof()) {
      // 0. Emit comments
      const htmlComment = HTMLCommentReader(stream, factory, this);
      if (htmlComment) {
        this.lastToken = htmlComment;
        return htmlComment;
      }
      const sourceMap = SourceMappingURLReader(stream, factory, this);
      if (sourceMap) {
        this.lastToken = sourceMap;
        return sourceMap;
      }
      const comment = CommentReader(stream, factory, this);
      if (comment) {
        this.lastToken = comment;
        return comment;
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
