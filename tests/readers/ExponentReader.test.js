import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ExponentReader } from "../../src/lexer/ExponentReader.js";

test("ExponentReader reads simple exponent", () => {
  const stream = new CharStream("1e10");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1e10");
  expect(stream.getPosition().index).toBe(4);
});

test("ExponentReader handles sign", () => {
  const stream = new CharStream("2E-3");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("2E-3");
  expect(stream.getPosition().index).toBe(4);
});

test("ExponentReader returns null when not exponent", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("ExponentReader returns null on invalid exponent", () => {
  const stream = new CharStream("1e");
  const pos = stream.getPosition();
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
