import { Token } from "../src/lexer/Token.js";

test("Token.toJSON produces plain object", () => {
  const tok = new Token(
    "NUMBER",
    "1",
    { line: 1, column: 0 },
    { line: 1, column: 1 }
  );
  const expected = {
    type: "NUMBER",
    value: "1",
    start: { line: 1, column: 0 },
    end: { line: 1, column: 1 }
  };
  expect(tok.toJSON()).toEqual(expected);
  expect(JSON.parse(JSON.stringify(tok))).toEqual(expected);
});
