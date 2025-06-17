import { IncrementalLexer } from '../src/integration/IncrementalLexer.js';

test('incremental lexer emits tokens as chunks are fed', () => {
  const types = [];
  const lexer = new IncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('let x');
  lexer.feed(' = 1;');
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'NUMBER',
    'PUNCTUATION'
  ]);
});

test('getTokens returns accumulated tokens', () => {
  const lexer = new IncrementalLexer();
  lexer.feed('let a');
  lexer.feed(' = 2;');
  const types = lexer.getTokens().map(t => t.type);
  expect(types).toEqual([
    'KEYWORD',
    'IDENTIFIER',
    'OPERATOR',
    'NUMBER',
    'PUNCTUATION'
  ]);
});

test('feeding whitespace only produces no tokens', () => {
  const lexer = new IncrementalLexer();
  lexer.feed('   ');
  expect(lexer.getTokens()).toEqual([]);
});
