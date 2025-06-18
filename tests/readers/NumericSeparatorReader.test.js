import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { NumericSeparatorReader } from "../../src/lexer/NumericSeparatorReader.js";

test("NumericSeparatorReader reads separated number", () => {
  const stream = new CharStream("1_000");
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1_000");
  expect(stream.getPosition().index).toBe(5);
});

test("NumericSeparatorReader rejects double underscore", () => {
  const stream = new CharStream("1__0");
  const pos = stream.getPosition();
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("NumericSeparatorReader returns null when no underscore", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
