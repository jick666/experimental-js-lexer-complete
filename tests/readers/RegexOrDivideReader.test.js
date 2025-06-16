import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

test("§4.5 reads regex literal", () => {
  const stream = new CharStream("/abc/g");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/abc/g");
  expect(stream.current()).toBe(null);
});

test("§4.5 reads regex with escaped slash", () => {
  const stream = new CharStream("/a\\/b/i");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/a\\/b/i");
});

test("§4.5 reads divide operator", () => {
  const stream = new CharStream("/ x");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("DIVIDE");
  expect(token.value).toBe("/");
  expect(stream.current()).toBe(" ");
});

test("§4.5 divide before comment", () => {
  const stream = new CharStream("// comment");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("DIVIDE");
  expect(stream.current()).toBe("/");
});
