import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { ShebangReader } from "../../src/lexer/ShebangReader.js";

test("ShebangReader reads shebang at start", () => {
  const stream = new CharStream("#!/usr/bin/env node\nconsole.log('x');");
  const tok = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("COMMENT");
  expect(tok.value).toBe("#!/usr/bin/env node");
  expect(stream.getPosition().index).toBe(19);
});

test("ShebangReader returns null when not at start", () => {
  const stream = new CharStream("console.log('x');");
  const pos = stream.getPosition();
  const tok = ShebangReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
