import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";

test("§4.6 TemplateStringReader: reads template literal with interpolation", () => {
  const code = "`template ${expr}`";
  const stream = new CharStream(code + " rest");
  const token = TemplateStringReader(stream, (t, v, s, e) => new Token(t, v, s, e));
  expect(token.type).toBe("TEMPLATE_STRING");
  expect(token.value).toBe(code);
  expect(stream.getPosition().index).toBe(code.length);
});

test("§4.6 TemplateStringReader: returns null when not at template", () => {
  const stream = new CharStream("abc");
  expect(TemplateStringReader(stream, () => {})).toBeNull();
});
