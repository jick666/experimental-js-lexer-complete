import { LexerError } from "../src/lexer/LexerError.js";

test("LexerError formatting helpers", () => {
  const err = new LexerError(
    "BadToken",
    "unexpected",
    { line: 1, column: 2 },
    { line: 1, column: 3 },
    "abc"
  );
  expect(err.location).toBe("line 1, column 2");
  expect(err.context).toBe("abc\n  ^");
  expect(err.toString()).toContain("LexerError[BadToken]");
  expect(err.toJSON()).toEqual({
    type: "BadToken",
    message: "unexpected",
    start: { line: 1, column: 2 },
    end: { line: 1, column: 3 }
  });
});
