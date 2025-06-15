import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

// Regex literal at beginning of input
test("RegexOrDivideReader reads regex literal", () => {
  const stream = new CharStream("/abc/g");
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/g");
  expect(stream.getPosition().index).toBe(6);
});

// Divide operator when preceded by identifier
test("RegexOrDivideReader reads divide operator", () => {
  const stream = new CharStream("a/b");
  stream.advance(); // move to '/'
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
  expect(stream.getPosition().index).toBe(2);
});

// '/=' operator
test("RegexOrDivideReader reads /= operator", () => {
  const stream = new CharStream("/=b");
  const token = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/=");
  expect(stream.getPosition().index).toBe(2);
});
