import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

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
