import { tokenize } from "../index.js";

test("integration: var declaration", () => {
  const toks = tokenize("let x = 5;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
});

test("integration: trailing whitespace does not produce null token", () => {
  const toks = tokenize("let x = 5;   ");
  expect(toks).not.toContain(null);
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
});

test("integration: tokenize throws on unterminated regex", () => {
  expect(() => tokenize("/abc")).toThrow();
});

test("integration: tokenize throws on unterminated template", () => {
  expect(() => tokenize("`oops")).toThrow();
});

test("integration: bigint and optional chaining", () => {
  const toks = tokenize("let x = 1n ?? obj?.prop;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "BIGINT",
    "OPERATOR",
    "IDENTIFIER",
    "OPERATOR",
    "IDENTIFIER",
    "PUNCTUATION"
  ]);
});
