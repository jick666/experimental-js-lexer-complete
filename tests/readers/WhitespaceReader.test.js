import { CharStream } from "../../src/lexer/CharStream.js";
import { WhitespaceReader } from "../../src/lexer/WhitespaceReader.js";

test("WhitespaceReader placeholder", () => {
  const stream = new CharStream("   abc");
  const token = WhitespaceReader(stream, () => {});
  expect(token).toBeNull();
});
