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

test("integration: hex literals", () => {
  const toks = tokenize("let n = 0x1A;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "PUNCTUATION"
  ]);
  expect(toks[3].value).toBe("0x1A");
});

test("integration: numeric separator with exponent splits tokens", () => {
  const toks = tokenize("let n = 1_0e3;");
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD",
    "IDENTIFIER",
    "OPERATOR",
    "NUMBER",
    "IDENTIFIER",
    "PUNCTUATION"
  ]);
});
