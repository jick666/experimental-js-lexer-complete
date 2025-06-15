import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

test("reads regex literal", () => {
  const stream = new CharStream("/abc/g");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/g");
  expect(stream.current()).toBe(null);
});

test("reads divide operator", () => {
  const stream = new CharStream("/ x");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("DIVIDE");
  expect(token.value).toBe("/");
  expect(stream.current()).toBe(" ");
});
