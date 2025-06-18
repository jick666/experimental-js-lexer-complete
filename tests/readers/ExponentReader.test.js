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

test("ExponentReader reads signed exponent", () => {
  const stream = new CharStream("2e-5");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("2e-5");
  expect(stream.getPosition().index).toBe(4);
});

test("ExponentReader reads decimal base", () => {
  const stream = new CharStream("3.14e2");
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("3.14e2");
  expect(stream.getPosition().index).toBe(6);
});

test("ExponentReader returns null when format invalid", () => {
  const stream = new CharStream("1e+");
  const idx = stream.getPosition().index;
  const tok = ExponentReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(idx);
});

