import { IdentifierReader } from './IdentifierReader.js';
import { NumberReader } from './NumberReader.js';
import { OperatorReader } from './OperatorReader.js';
import { PunctuationReader } from './PunctuationReader.js';
import { RegexOrDivideReader } from './RegexOrDivideReader.js';
import { TemplateStringReader } from './TemplateStringReader.js';
import { WhitespaceReader } from './WhitespaceReader.js';
import { Token } from './Token.js';
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

/**
 * LexerEngine orchestrates all token readers to produce a stream of Tokens.
 */
export class LexerEngine {
  constructor(stream) {
    this.stream = stream;
    // The order here determines matching priority:
    this.readers = [
      IdentifierReader,
      NumberReader,
      OperatorReader,
      PunctuationReader,
      RegexOrDivideReader,
      TemplateStringReader
    ];
  }

  /**
   * Reads the next token from the stream, or returns null at EOF.
   */
  nextToken() {
    const { stream } = this;
    const factory = (type, value, start, end) => new Token(type, value, start, end);

    while (!stream.eof()) {
      // 1. Skip whitespace (and collect as trivia internally, if desired)
      WhitespaceReader(stream, factory);
      if (stream.eof()) break;

      // 2. Try each reader in sequence
      for (const Reader of this.readers) {
        const token = Reader(stream, factory);
        if (token) {
          // 3. Promote identifiers that match keywords
          if (
            token.type === 'IDENTIFIER' &&
            JavaScriptGrammar.keywords.includes(token.value)
          ) {
            token.type = 'KEYWORD';
          }
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
