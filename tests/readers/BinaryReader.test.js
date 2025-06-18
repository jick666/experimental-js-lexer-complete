import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { BinaryReader } from "../../src/lexer/BinaryReader.js";

test("BinaryReader reads binary literal", () => {
  const stream = new CharStream("0b1010");
  const tok = BinaryReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("0b1010");
  expect(stream.getPosition().index).toBe(6);
});

test("BinaryReader returns null when not binary", () => {
  const stream = new CharStream("0b");
  const pos = stream.getPosition();
  const tok = BinaryReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
