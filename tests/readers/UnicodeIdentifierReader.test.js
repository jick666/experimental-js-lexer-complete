import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { UnicodeIdentifierReader } from "../../src/lexer/UnicodeIdentifierReader.js";

test("UnicodeIdentifierReader reads unicode identifier", () => {
  const stream = new CharStream("π");
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("IDENTIFIER");
  expect(tok.value).toBe("π");
  expect(stream.getPosition().index).toBe(1);
});

test("UnicodeIdentifierReader returns null for ascii digit", () => {
  const stream = new CharStream("1abc");
  const pos = stream.getPosition();
  const tok = UnicodeIdentifierReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
