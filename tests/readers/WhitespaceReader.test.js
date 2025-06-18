import { CharStream } from "../../src/lexer/CharStream.js";
import { WhitespaceReader } from "../../src/lexer/WhitespaceReader.js";

test("WhitespaceReader skips consecutive whitespace", () => {
  const stream = new CharStream("   abc");
  const token = WhitespaceReader(stream, () => {});
  expect(token).toBeNull();
  expect(stream.getPosition().index).toBe(3);
  expect(stream.current()).toBe("a");
});
