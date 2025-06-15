import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";

test("TemplateStringReader reads template with expression", () => {
  const stream = new CharStream("`template ${expr}`");
  const token = TemplateStringReader(stream, (type, value, start, end) => new Token(type, value, start, end));
  expect(token.type).toBe("TEMPLATE_STRING");
  expect(token.value).toBe("`template ${expr}`");
});
