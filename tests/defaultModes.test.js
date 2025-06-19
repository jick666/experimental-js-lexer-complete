import { createDefaultModes } from "../src/lexer/defaultModes.js";
import { baseReaders } from "../src/lexer/defaultReaders.js";
import { TemplateStringReader } from "../src/lexer/TemplateStringReader.js";
import { RegexOrDivideReader } from "../src/lexer/RegexOrDivideReader.js";
import { JSXReader } from "../src/lexer/JSXReader.js";

test("createDefaultModes returns mode mappings", () => {
  const modes = createDefaultModes(
    baseReaders,
    TemplateStringReader,
    RegexOrDivideReader,
    JSXReader
  );
  expect(modes.default).toEqual(baseReaders);
  expect(modes.default).not.toBe(baseReaders); // copy
  expect(modes.template_string).toEqual([TemplateStringReader]);
  expect(modes.regex).toEqual([RegexOrDivideReader]);
  expect(modes.jsx).toEqual([JSXReader]);
});
