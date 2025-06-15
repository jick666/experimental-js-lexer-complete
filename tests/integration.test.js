import { tokenize } from "../index.js";
test("integration: var declaration", () => {
  const toks = tokenize("let x = 5;");
  expect(toks.map(t => t.type)).toEqual(["KEYWORD","IDENTIFIER","OPERATOR","NUMBER","PUNCTUATION"]);
});
