import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { NumberReader } from "../../src/lexer/NumberReader.js";

test("NumberReader reads integer and decimal", () => {
  const stream = new CharStream("123 456.78");
  let token = NumberReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("123");
  stream.advance();
  token = NumberReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("NUMBER");
  expect(token.value).toBe("456.78");
});

test("NumberReader handles hex, octal, binary, exponent and underscores", () => {
  const cases = [
    { src: "0x1f", value: "0x1f" },
    { src: "0o10", value: "0o10" },
    { src: "0b1010", value: "0b1010" },
    { src: "1e4", value: "1e4" },
    { src: "1_000", value: "1_000" },
    { src: "123_456.78", value: "123_456.78" },
    { src: "6.02e23", value: "6.02e23" },
    { src: "0xFF_A0", value: "0xFF_A0" }
  ];

  for (const c of cases) {
    const stream = new CharStream(c.src);
    const token = NumberReader(stream, (t, v, s, e) => new Token(t, v, s, e));
    expect(token.type).toBe("NUMBER");
    expect(token.value).toBe(c.value);
    expect(stream.getPosition().index).toBe(c.src.length);
  }
});

test("NumberReader returns null for invalid literals", () => {
  const invalid = ["0x", "0b102", "1__0", "1_", "1e", "1e-"];
  for (const src of invalid) {
    const stream = new CharStream(src);
    const token = NumberReader(stream, (t, v, s, e) => new Token(t, v, s, e));
    expect(token).toBeNull();
  }
});
