import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

const factory = (t,v,s,e) => new Token(t,v,s,e);

test("reads regex literal at start", () => {
  const stream = new CharStream("/abc/");
  const token = RegexOrDivideReader(stream, factory);
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/");
});

test("reads divide operator between identifiers", () => {
  const stream = new CharStream("a / b");
  stream.advance(); // a
  stream.advance(); // space, now at '/'
  const token = RegexOrDivideReader(stream, factory);
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
});

test("reads divide assignment", () => {
  const stream = new CharStream("a /= b");
  stream.advance();
  stream.advance();
  const token = RegexOrDivideReader(stream, factory);
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/=");
});

test("regex after equals", () => {
  const stream = new CharStream("x=/abc/");
  stream.advance(); // x
  const eq = stream.current();
  expect(eq).toBe("=");
  stream.advance(); // '=' -> now at '/'
  const token = RegexOrDivideReader(stream, factory);
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/");
});

test("regex after paren", () => {
  const stream = new CharStream("(/abc/)");
  stream.advance(); // '('
  const token = RegexOrDivideReader(stream, factory);
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/");
});
