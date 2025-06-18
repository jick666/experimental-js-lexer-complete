import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { NumericSeparatorReader } from "../../src/lexer/NumericSeparatorReader.js";

test("NumericSeparatorReader reads number with separators", () => {
  const stream = new CharStream("1_000");
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe("1000");
  expect(stream.getPosition().index).toBe(5);
});

test("NumericSeparatorReader returns null when no separators", () => {
  const stream = new CharStream("1234");
  const pos = stream.getPosition();
  const tok = NumericSeparatorReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
