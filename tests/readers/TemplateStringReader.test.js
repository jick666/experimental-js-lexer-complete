import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { TemplateStringReader } from "../../src/lexer/TemplateStringReader.js";

function makeEngine() {
  return {
    stateStack: ["default"],
    pushMode(mode) { this.stateStack.push(mode); },
    popMode() { this.stateStack.pop(); },
    currentMode() { return this.stateStack[this.stateStack.length - 1]; }
  };
}

test("TemplateStringReader mode transitions", () => {
  const engine = makeEngine();
  const stream = new CharStream("`hi`");
  const factory = (t,v,s,e) => new Token(t,v,s,e);

  const startTok = TemplateStringReader(stream, factory, engine);
  expect(startTok.type).toBe("TEMPLATE_START");
  expect(engine.currentMode()).toBe("template_string");

  const bodyTok = TemplateStringReader(stream, factory, engine);
  expect(bodyTok.type).toBe("TEMPLATE_CHARS");
  expect(bodyTok.value).toBe("hi");
  expect(engine.currentMode()).toBe("template_string");

  const endTok = TemplateStringReader(stream, factory, engine);
  expect(endTok.type).toBe("TEMPLATE_END");
  expect(engine.currentMode()).toBe("default");
});
