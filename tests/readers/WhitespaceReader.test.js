import { CharStream } from "../../src/lexer/CharStream.js";
import { WhitespaceReader } from "../../src/lexer/WhitespaceReader.js";

test("WhitespaceReader skips whitespace and updates position", () => {
  const stream = new CharStream("  \n\tabc");
  const token = WhitespaceReader(stream, () => {});
  expect(token).toBeNull();
  // After skipping two spaces, newline and a tab
  expect(stream.getPosition()).toEqual({ line: 2, column: 1, index: 4 });
});

test("WhitespaceReader no-op when not at whitespace", () => {
  const stream = new CharStream("abc");
  const start = stream.getPosition();
  const token = WhitespaceReader(stream, () => {});
  expect(token).toBeNull();
  expect(stream.getPosition()).toEqual(start);
});
