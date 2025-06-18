import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { HexReader } from "../../src/lexer/HexReader.js";

test("HexReader reads hex literal", () => {
  const stream = new CharStream("0x1A3F");
  const tok = HexReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0x1A3F");
  expect(stream.getPosition().index).toBe(6);
});

test("HexReader returns null when not hex", () => {
  const stream = new CharStream("123");
  const pos = stream.getPosition();
  const tok = HexReader(stream, ()=>{});
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
