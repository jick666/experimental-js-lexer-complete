import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";

test("RegexOrDivideReader reads regex literal", () => {
  const stream = new CharStream("/abc/g");
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/g");
  expect(stream.getPosition().index).toBe(6);
});

test("RegexOrDivideReader reads divide operator", () => {
  const stream = new CharStream("a/b");
  // advance past the 'a'
  stream.advance();
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
  expect(stream.getPosition().index).toBe(2);
});

test("RegexOrDivideReader reads '/=' operator", () => {
  const stream = new CharStream("/=b");
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/=");
  expect(stream.getPosition().index).toBe(2);
});

test("RegexOrDivideReader returns LexerError on unterminated regex", () => {
  const stream = new CharStream("/abc");
  const result = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe("UnterminatedRegex");
  expect(result.toString()).toContain("line 1, column 0");
});

test("RegexOrDivideReader handles escaped slashes", () => {
  const stream = new CharStream("/a\\/b/i");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/a\\/b/i");
});

test("RegexOrDivideReader treats context after paren as regex", () => {
  const stream = new CharStream("( /a/ )");
  stream.advance(); // (
  stream.advance(); // space
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/a/");
});
