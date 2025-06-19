import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

import { CommentReader } from "../../src/lexer/CommentReader.js";
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

test("RegexOrDivideReader returns INVALID_REGEX token on unterminated regex", () => {
  const stream = new CharStream("/abc");
  const result = RegexOrDivideReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(result.type).toBe("INVALID_REGEX");
  expect(result.value).toBe("/abc");
});

test("RegexOrDivideReader handles escaped slashes", () => {
  const stream = new CharStream("/a\\/b/i");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/a\\/b/i");
});

test("RegexOrDivideReader handles character classes", () => {
  const stream = new CharStream("/[a-z]/g");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/[a-z]/g");
});

test("RegexOrDivideReader handles slashes in character classes", () => {
  const stream = new CharStream("/[a\\/b]/");
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/[a\\/b]/");
});

test("RegexOrDivideReader treats context after paren as regex", () => {
  const stream = new CharStream("( /a/ )");
  stream.advance(); // (
  stream.advance(); // space
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/a/");
});

test("RegexOrDivideReader treats newline after regex starter as regex", () => {
  const stream = new CharStream("1+\n/foo/");
  stream.advance(); // '1'
  stream.advance(); // '+'
  stream.advance(); // '\n'
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe("/foo/");
});

test("RegexOrDivideReader treats newline after identifier as divide", () => {
  const stream = new CharStream("a\n/b/");
  stream.advance(); // 'a'
  stream.advance(); // '\n'
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
});

test("RegexOrDivideReader allows newline inside regex literal", () => {
  const src = "/a\nb/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
});


test("RegexOrDivideReader treats slash after block comment as divide", () => {
  const src = "a/*x*/ /b/";
  const stream = new CharStream(src);
  stream.advance(); // 'a'
  CommentReader(stream, () => {}); // consume comment
  stream.advance(); // space before slash
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
});

test("RegexOrDivideReader treats newline after closing paren as divide", () => {
  const src = "(1)\n/abc/";
  const stream = new CharStream(src);
  stream.advance(); // (
  stream.advance(); // '1'
  stream.advance(); // )
  stream.advance(); // \n
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
});

test("RegexOrDivideReader returns INVALID_REGEX token on unterminated character class", () => {
  const src = "/[abc/";
  const stream = new CharStream(src);
  const result = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(result.type).toBe("INVALID_REGEX");
  expect(result.value).toBe(src);
});

test("RegexOrDivideReader treats slash after line comment as divide", () => {
  const src = "a//c\n/b/";
  const stream = new CharStream(src);
  stream.advance(); // 'a'
  CommentReader(stream, () => {}); // consume line comment
  stream.advance(); // newline
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("OPERATOR");
  expect(token.value).toBe("/");
});

test("RegexOrDivideReader handles quantifiers and groups", () => {
  const src = "/a{2,3}(b[c]+)*/g";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("RegexOrDivideReader handles escaped closing bracket", () => {
  const src = "/[a-z\\]]+/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("RegexOrDivideReader handles named capture groups", () => {
  const src = "/foo(?<name>bar)/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
});

test("RegexOrDivideReader handles multiple named capture groups", () => {
  const src = "/(?<foo>a)(?<bar>b)/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
});

test("RegexOrDivideReader rejects invalid capture group names", () => {
  const src = "/(?<1foo>bar)/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("INVALID_REGEX");
});

test("RegexOrDivideReader handles lookbehind assertions", () => {
  const src = "/(?<=foo)bar/";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
});

test("RegexOrDivideReader handles Unicode property escapes", () => {
  const src = "/\\p{Letter}+/u";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
});

test("RegexOrDivideReader handles negative Unicode property escapes", () => {
  const src = "/\\P{Script=Latin}/u";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("REGEX");
  expect(token.value).toBe(src);
});

test("RegexOrDivideReader rejects unknown Unicode property", () => {
  const src = "/\\p{UnknownProp}/u";
  const stream = new CharStream(src);
  const token = RegexOrDivideReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(token.type).toBe("INVALID_REGEX");
});
