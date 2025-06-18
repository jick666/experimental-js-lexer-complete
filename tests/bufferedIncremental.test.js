import { BufferedIncrementalLexer } from "../src/integration/BufferedIncrementalLexer.js";

test("BufferedIncrementalLexer buffers across chunks", () => {
  const lexer = new BufferedIncrementalLexer();
  lexer.feed("let a = 1");
  let types = lexer.getTokens().map(t => t.type);
  expect(types).toEqual(["KEYWORD", "IDENTIFIER", "OPERATOR", "NUMBER"]);
  lexer.feed(";");
  types = lexer.getTokens().map(t => t.type);
  expect(types).toEqual(["KEYWORD", "IDENTIFIER", "OPERATOR", "NUMBER", "PUNCTUATION"]);
});
