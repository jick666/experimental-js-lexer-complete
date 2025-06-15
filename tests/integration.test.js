import { tokenize } from "../index.js";
test("integration: var declaration", () => {
  const toks = tokenize("let x = 5;");
  expect(toks.map(t => t.type)).toEqual(["KEYWORD","IDENTIFIER","OPERATOR","NUMBER","PUNCTUATION"]);
});

test("integration: template string and regex modes", () => {
  const code = "const t = `hi`; /abc/;";
  const toks = tokenize(code);
  expect(toks.map(t => t.type)).toEqual([
    "KEYWORD","IDENTIFIER","OPERATOR",
    "TEMPLATE_START","TEMPLATE_CHARS","TEMPLATE_END","PUNCTUATION",
    "REGEX_START","REGEX_BODY","REGEX_END","PUNCTUATION"
  ]);
});

import { CharStream } from "../src/lexer/CharStream.js";
import { LexerEngine } from "../src/lexer/LexerEngine.js";

test("integration: engine state stack transitions", () => {
  const stream = new CharStream("`hi`");
  const lexer = new LexerEngine(stream);
  expect(lexer.currentMode()).toBe("default");
  const t1 = lexer.nextToken();
  expect(t1.type).toBe("TEMPLATE_START");
  expect(lexer.currentMode()).toBe("template_string");
  lexer.nextToken(); // TEMPLATE_CHARS
  expect(lexer.currentMode()).toBe("template_string");
  lexer.nextToken(); // TEMPLATE_END
  expect(lexer.currentMode()).toBe("default");
});
