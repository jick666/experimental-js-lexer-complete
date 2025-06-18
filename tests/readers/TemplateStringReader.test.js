import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";
import { LexerError } from "../../src/lexer/LexerError.js";

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

test("TemplateStringReader returns LexerError on unterminated template", () => {
  const stream = new CharStream('`unterminated');
  const result = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('UnterminatedTemplate');
  expect(result.toString()).toContain('line 1, column 0');
});

test("TemplateStringReader returns LexerError on bad escape", () => {
  const stream = new CharStream('`bad \\');
  const result = TemplateStringReader(
    stream,
    (type, value, start, end) => new Token(type, value, start, end)
  );
  expect(result).toBeInstanceOf(LexerError);
  expect(result.type).toBe('BadEscape');
  expect(result.toString()).toContain('line 1, column 5');
});

test("TemplateStringReader handles escapes and nested braces", () => {
  const src = "`a ${b\\} c}`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e)
  );
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});

test("TemplateStringReader tracks nested braces", () => {
  const src = "`t ${ {a:{b}} } end`";
  const stream = new CharStream(src);
  const token = TemplateStringReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e)
  );
  expect(token.value).toBe(src);
  expect(stream.getPosition().index).toBe(src.length);
});
