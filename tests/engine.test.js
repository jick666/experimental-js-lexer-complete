import { jest } from "@jest/globals";
import { CharStream } from "../src/lexer/CharStream.js";
import { LexerEngine } from "../src/lexer/LexerEngine.js";

import { LexerError } from "../src/lexer/LexerError.js";
test("LexerEngine pushMode and popMode manage state stack", () => {
  const engine = new LexerEngine(new CharStream(""));
  expect(engine.currentMode()).toBe("default");
  engine.pushMode("template_string");
  expect(engine.currentMode()).toBe("template_string");
  engine.popMode();
  expect(engine.currentMode()).toBe("default");
});

test("nextToken promotes identifiers that match keywords", () => {
  const engine = new LexerEngine(new CharStream("let x;"));
  const tok = engine.nextToken();
  expect(tok.type).toBe("KEYWORD");
});

test("nextToken returns comments before other tokens", () => {
  const engine = new LexerEngine(new CharStream("/*c*/1"));
  const first = engine.nextToken();
  expect(first.type).toBe("COMMENT");
  const second = engine.nextToken();
  expect(second.type).toBe("NUMBER");
});

test("nextToken auto-enables JSX mode", () => {
  const engine = new LexerEngine(new CharStream("<div/>"));
  const spy = jest.spyOn(engine, "pushMode");
  const tok = engine.nextToken();
  expect(tok.type).toBe("JSX_TEXT");
  expect(spy).toHaveBeenCalledWith("jsx");
  expect(engine.currentMode()).toBe("default");
});

test("nextToken does not treat comparison as JSX", () => {
  const engine = new LexerEngine(new CharStream("a < b"));
  const t1 = engine.nextToken();
  const t2 = engine.nextToken();
  const t3 = engine.nextToken();
  expect(t1.type).toBe("IDENTIFIER");
  expect(t2.value).toBe("<");
  expect(t3.type).toBe("IDENTIFIER");
});

test("nextToken rethrows reader errors", () => {
  const engine = new LexerEngine(new CharStream("/abc"));
  let err;
  try {
    engine.nextToken();
  } catch (e) {
    err = e;
  }
  expect(err).toBeInstanceOf(LexerError);
  expect(err.type).toBe("UnterminatedRegex");
});

test("peek returns upcoming tokens without consuming", () => {
  const engine = new LexerEngine(new CharStream("1 + 2"));
  expect(engine.peek().type).toBe("NUMBER");
  // repeated peek should not consume
  expect(engine.peek().value).toBe("1");
  // nextToken should yield the same first token
  expect(engine.nextToken().value).toBe("1");
  // whitespace token follows
  expect(engine.peek().type).toBe("WHITESPACE");
  // peek with n=2 should see the operator
  expect(engine.peek(2).value).toBe("+");
  // peek with n=4 should see the final number
  expect(engine.peek(4).value).toBe("2");
  // consume whitespace then operator
  expect(engine.nextToken().type).toBe("WHITESPACE");
  expect(engine.nextToken().value).toBe("+");
});
