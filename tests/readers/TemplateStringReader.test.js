import { CharStream } from "../../src/lexer/CharStream.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";

test("TemplateStringReader placeholder", () => {
  const stream = new CharStream("`template ${expr}`");
  const token = TemplateStringReader(stream, () => {});
  expect(token).toBeNull();
});
