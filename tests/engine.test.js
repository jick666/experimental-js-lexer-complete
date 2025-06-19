import { jest } from "@jest/globals";
import { CharStream } from "../src/lexer/CharStream.js";
import { LexerEngine } from "../src/lexer/LexerEngine.js";

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

test("nextToken returns INVALID_REGEX token instead of throwing", () => {
  const engine = new LexerEngine(new CharStream("/abc"));
  const tok = engine.nextToken();
  expect(tok.type).toBe("INVALID_REGEX");
});

test("peek returns upcoming tokens without consuming", () => {
  const engine = new LexerEngine(new CharStream("1 + 2"));
  expect(engine.peek().type).toBe("NUMBER");
  // repeated peek should not consume
  expect(engine.peek().value).toBe("1");
  // nextToken should yield the same first token
  expect(engine.nextToken().value).toBe("1");
  // peek with n=2 should see the third token
  expect(engine.peek(2).value).toBe("2");
  expect(engine.nextToken().value).toBe("+");
});
