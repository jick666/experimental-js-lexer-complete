import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { BigIntReader } from "../../src/lexer/BigIntReader.js";

 test("BigIntReader reads bigint literal", () => {
   const stream = new CharStream("123n");
   const tok = BigIntReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok.type).toBe("BIGINT");
   expect(tok.value).toBe("123n");
   expect(stream.getPosition().index).toBe(4);
 });

 test("BigIntReader returns null without trailing n", () => {
   const stream = new CharStream("123");
   const pos = stream.getPosition();
   const tok = BigIntReader(stream, (t,v,s,e) => new Token(t,v,s,e));
   expect(tok).toBeNull();
   expect(stream.getPosition()).toEqual(pos);
 });

test("BigIntReader rejects decimal values", () => {
  const stream = new CharStream("1.0n");
  const pos = stream.getPosition();
  const tok = BigIntReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader rejects prefixed binary bigints", () => {
  const stream = new CharStream("0b101n");
  const pos = stream.getPosition();
  const tok = BigIntReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader rejects hex bigints", () => {
  const stream = new CharStream("0x1Fn");
  const pos = stream.getPosition();
  const tok = BigIntReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("BigIntReader stops before trailing digits", () => {
  const stream = new CharStream("1n2");
  const tok = BigIntReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("BIGINT");
  expect(tok.value).toBe("1n");
  expect(stream.current()).toBe("2");
});
