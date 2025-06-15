import { tokenize } from "../index.js";
test("integration: var declaration", () => {
  const toks = tokenize("let x = 5;");
  expect(toks.map(t => t.type)).toEqual(["KEYWORD","IDENTIFIER","OPERATOR","NUMBER","PUNCTUATION"]);
});

test("integration: trailing whitespace does not produce null token", () => {
  const toks = tokenize("let x = 5;   ");
  expect(toks).not.toContain(null);
  expect(toks.map(t => t.type)).toEqual(["KEYWORD","IDENTIFIER","OPERATOR","NUMBER","PUNCTUATION"]);
});
