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

test("RegexOrDivideReader handles character class", () => {
  const src = "/[a-z]+/g";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("RegexOrDivideReader handles nested brackets", () => {
  const src = "/[a-z[0-9]]+/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("RegexOrDivideReader handles escapes inside character class", () => {
  const src = "/[\\/\]]+/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});
