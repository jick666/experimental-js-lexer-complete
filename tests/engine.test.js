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
