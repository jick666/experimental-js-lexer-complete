import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ExponentReader } from "../../src/lexer/ExponentReader.js";

test("ExponentReader reads simple exponent", () => {
  const stream = new CharStream("1e3");
  const tok = ExponentReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1e3");
  expect(stream.getPosition().index).toBe(3);
});

test("ExponentReader reads decimal exponent with sign", () => {
  const stream = new CharStream("3.5E+2");
  const tok = ExponentReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("3.5E+2");
  expect(stream.getPosition().index).toBe(6);
});

test("ExponentReader returns null when missing digits", () => {
  const stream = new CharStream("2e+");
  const pos = stream.getPosition();
  const tok = ExponentReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("ExponentReader returns null when no exponent", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = ExponentReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

