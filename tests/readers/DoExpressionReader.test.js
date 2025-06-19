import { jest } from "@jest/globals";
import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { DoExpressionReader } from "../../src/lexer/DoExpressionReader.js";

const mk = (t,v,s,e) => new Token(t,v,s,e);

test("DoExpressionReader reads do block start", () => {
  const stream = new CharStream("do {");
  const engine = { pushMode: jest.fn(), currentMode: () => "default" };
  const tok = DoExpressionReader(stream, mk, engine);
  expect(tok.type).toBe("DO_BLOCK_START");
  expect(tok.value).toBe("do {");
  expect(engine.pushMode).toHaveBeenCalledWith("do_block");
});

test("DoExpressionReader reads do block end", () => {
  const stream = new CharStream("}");
  const engine = { currentMode: () => "do_block", popMode: jest.fn() };
  const tok = DoExpressionReader(stream, mk, engine);
  expect(tok.type).toBe("DO_BLOCK_END");
  expect(tok.value).toBe("}");
  expect(engine.popMode).toHaveBeenCalled();
});

test("DoExpressionReader returns null when not matched", () => {
  const stream = new CharStream("doSomething");
  const engine = { currentMode: () => "default" };
  const pos = stream.getPosition();
  const tok = DoExpressionReader(stream, mk, engine);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
