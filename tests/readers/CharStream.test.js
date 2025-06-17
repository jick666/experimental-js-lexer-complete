import { CharStream } from "../../src/lexer/CharStream.js";

test("CharStream advance updates line and column across newlines", () => {
  const stream = new CharStream("a\nb\n");
  // start position before any advance
  expect(stream.getPosition()).toEqual({ line: 1, column: 0, index: 0 });

  // advance over 'a'
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 1, column: 1, index: 1 });

  // advance over '\n' should increment line and reset column
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 2, column: 0, index: 2 });

  // advance over 'b'
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 2, column: 1, index: 3 });

  // advance over final '\n'
  stream.advance();
  expect(stream.getPosition()).toEqual({ line: 3, column: 0, index: 4 });
});

test("CharStream setPosition restores previous position", () => {
  const stream = new CharStream("abc");
  stream.advance();
  stream.advance();
  const pos = stream.getPosition();
  stream.advance();
  expect(stream.getPosition().index).toBe(3);
  stream.setPosition(pos);
  expect(stream.getPosition()).toEqual(pos);
});
