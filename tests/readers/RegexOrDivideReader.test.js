import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { RegexOrDivideReader } from "../../src/lexer/RegexOrDivideReader.js";

function makeEngine() {
  return {
    stateStack: ["default"],
    pushMode(mode) { this.stateStack.push(mode); },
    popMode() { this.stateStack.pop(); },
    currentMode() { return this.stateStack[this.stateStack.length - 1]; }
  };
}

test("RegexOrDivideReader mode transitions", () => {
  const engine = makeEngine();
  const stream = new CharStream("/abc/");
  const factory = (t,v,s,e) => new Token(t,v,s,e);

  const startTok = RegexOrDivideReader(stream, factory, engine);
  expect(startTok.type).toBe("REGEX_START");
  expect(engine.currentMode()).toBe("regex");

  const bodyTok = RegexOrDivideReader(stream, factory, engine);
  expect(bodyTok.type).toBe("REGEX_BODY");
  expect(bodyTok.value).toBe("abc");
  expect(engine.currentMode()).toBe("regex");

  const endTok = RegexOrDivideReader(stream, factory, engine);
  expect(endTok.type).toBe("REGEX_END");
  expect(engine.currentMode()).toBe("default");
});
