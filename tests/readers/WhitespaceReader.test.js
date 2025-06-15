import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { WhitespaceReader } from "../../src/lexer/WhitespaceReader.js";

test("WhitespaceReader skips whitespace", () => {
  const stream = new CharStream("   abc");
  const token = WhitespaceReader(stream, () => {});
  expect(token).toBeNull();
  expect(stream.getPosition().index).toBe(3);
  expect(stream.current()).toBe("a");
});

test("WhitespaceReader can return trivia token", () => {
  const stream = new CharStream(" \t\n");
  const token = WhitespaceReader(
    stream,
    (t, v, s, e) => new Token(t, v, s, e),
    true
  );
  expect(token.type).toBe("WHITESPACE");
  expect(token.value).toBe(" \t\n");
  expect(stream.getPosition().index).toBe(3);
});
