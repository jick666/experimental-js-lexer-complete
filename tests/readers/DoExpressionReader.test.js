import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { DoExpressionReader } from "../../src/lexer/DoExpressionReader.js";

test("DoExpressionReader reads block start", () => {
  const stream = new CharStream("do {");
  let pushed = null;
  const engine = { currentMode: () => 'default', pushMode: m => { pushed = m; }, popMode: () => {} };
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok.type).toBe("DO_BLOCK_START");
  expect(tok.value).toBe("do {");
  expect(pushed).toBe('do_block');
});

test("DoExpressionReader reads block end", () => {
  const stream = new CharStream("}");
  let popped = false;
  const engine = { currentMode: () => 'do_block', pushMode: () => {}, popMode: () => { popped = true; } };
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok.type).toBe("DO_BLOCK_END");
  expect(tok.value).toBe("}");
  expect(popped).toBe(true);
});

test("DoExpressionReader returns null when not matching", () => {
  const stream = new CharStream("do");
  const engine = { currentMode: () => 'default', pushMode: () => {}, popMode: () => {} };
  const pos = stream.getPosition();
  const tok = DoExpressionReader(stream, (t,v,s,e) => new Token(t,v,s,e), engine);
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
