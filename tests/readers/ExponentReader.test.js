import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ExponentReader } from "../../src/lexer/ExponentReader.js";

test("ExponentReader reads simple exponent", () => {
  const stream = new CharStream("1e5");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1e5");
  expect(stream.getPosition().index).toBe(3);
});

test("ExponentReader reads signed exponent", () => {
  const stream = new CharStream("2e+7");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("2e+7");
  expect(stream.getPosition().index).toBe(4);
});

test("ExponentReader reads negative exponent", () => {
  const stream = new CharStream("3e-2");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("3e-2");
  expect(stream.getPosition().index).toBe(4);
});

test("ExponentReader reads uppercase E and decimals", () => {
  const stream = new CharStream("4.1E8");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("4.1E8");
  expect(stream.getPosition().index).toBe(5);
});

test("ExponentReader returns null on invalid", () => {
  const stream = new CharStream("5e");
  const index = stream.getPosition().index;
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(index);
});
