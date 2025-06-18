import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { NumericSeparatorReader } from "../../src/lexer/NumericSeparatorReader.js";

// valid separators
const cases = [
  ["1_000", 5],
  ["12_34_56", 8]
];

test.each(cases)("NumericSeparatorReader reads %s", (input, end) => {
  const stream = new CharStream(input);
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok.type).toBe("NUMBER");
  expect(tok.value).toBe(input);
  expect(stream.getPosition().index).toBe(end);
});

test("NumericSeparatorReader returns null for trailing underscore", () => {
  const stream = new CharStream("1_");
  const idx = stream.getPosition().index;
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(idx);
});

test("NumericSeparatorReader returns null for consecutive underscores", () => {
  const stream = new CharStream("1__0");
  const idx = stream.getPosition().index;
  const tok = NumericSeparatorReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(tok).toBeNull();
  expect(stream.getPosition().index).toBe(idx);
});

