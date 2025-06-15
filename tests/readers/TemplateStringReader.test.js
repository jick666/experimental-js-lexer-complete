import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";

test("TemplateStringReader reads template with interpolation", () => {
  const src = "`template ${expr}`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );

  expect(token.type).toBe("TEMPLATE_STRING");
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader returns null for non-backtick start", () => {
  const stream = new CharStream("'not template'");
  const result = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );

  expect(result).toBeNull();
});
