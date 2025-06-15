import { CharStream } from "../../src/lexer/CharStream.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

test("RegexOrDivideReader placeholder", () => {
  const stream = new CharStream("/abc/");
  const token = RegexOrDivideReader(stream, () => {});
  expect(token).toBeNull();
});
