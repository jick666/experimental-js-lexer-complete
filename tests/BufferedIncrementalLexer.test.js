import { BufferedIncrementalLexer } from '../src/integration/BufferedIncrementalLexer.js';

test('buffers incomplete string across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('const s = "hel');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR']);
  lexer.feed('lo";');
  expect(types).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'STRING', 'PUNCTUATION']);
});

test('getTokens includes buffered results only when complete', () => {
  const lexer = new BufferedIncrementalLexer();
  lexer.feed('let a = "');
  expect(lexer.getTokens().map(t => t.type)).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR']);
  lexer.feed('b";');
  expect(lexer.getTokens().map(t => t.type)).toEqual(['KEYWORD', 'IDENTIFIER', 'OPERATOR', 'STRING', 'PUNCTUATION']);
});

test('buffers incomplete multi-line comment across feeds', () => {
  const types = [];
  const lexer = new BufferedIncrementalLexer({ onToken: t => types.push(t.type) });
  lexer.feed('/* hello');
  expect(types).toEqual([]);
  lexer.feed(' world */ let x = 1;');
  expect(types).toEqual(['COMMENT', 'KEYWORD', 'IDENTIFIER', 'OPERATOR', 'NUMBER', 'PUNCTUATION']);
});

