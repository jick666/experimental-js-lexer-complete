import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { UnicodeIdentifierReader } from "../../src/lexer/UnicodeIdentifierReader.js";

test("UnicodeIdentifierReader reads identifier with unicode start", () => {
  const stream = new CharStream("éfoo ");
  const tok = UnicodeIdentifierReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("IDENTIFIER");
  expect(tok.value).toBe("éfoo");
  expect(stream.getPosition().index).toBe(4);
});

test("UnicodeIdentifierReader returns null for ascii start", () => {
  const stream = new CharStream("abc");
  const pos = stream.getPosition();
  const tok = UnicodeIdentifierReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});

test("UnicodeIdentifierReader handles joiner characters", () => {
  const stream = new CharStream("é\u200Dbar");
  const tok = UnicodeIdentifierReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.value).toBe("é\u200Dbar");
  expect(stream.getPosition().index).toBe(5);
});

