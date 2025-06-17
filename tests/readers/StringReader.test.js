import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { StringReader } from "../../src/lexer/StringReader.js";

test("StringReader reads quoted strings", () => {
  const stream = new CharStream("'abc' \"def\"");
  let token = StringReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("STRING");
  expect(token.value).toBe("'abc'");
  stream.advance(); // skip space
  token = StringReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("STRING");
  expect(token.value).toBe('"def"');
});

test("StringReader handles escape sequences", () => {
  const src = "\"a\\n\"";
  const stream = new CharStream(src);
  const token = StringReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.value).toBe(src);
  expect(token.type).toBe("STRING");
  expect(stream.getPosition().index).toBe(src.length);
});

test("StringReader returns null for unterminated", () => {
  const stream = new CharStream("'oops");
  const token = StringReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token).toBeNull();
  expect(stream.getPosition().index).toBe(0);
});
