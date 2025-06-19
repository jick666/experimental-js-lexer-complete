import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { PatternMatchReader } from "../../src/lexer/PatternMatchReader.js";

test("PatternMatchReader reads match", () => {
  const stream = new CharStream("match x");
  const tok = PatternMatchReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("MATCH");
  expect(tok.value).toBe("match");
});

test("PatternMatchReader reads case", () => {
  const stream = new CharStream("case 1:");
  const tok = PatternMatchReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok.type).toBe("CASE");
  expect(tok.value).toBe("case");
});

test("PatternMatchReader returns null inside identifier", () => {
  const stream = new CharStream("encase");
  stream.advance();
  const pos = stream.getPosition();
  const tok = PatternMatchReader(stream, (t,v,s,e) => new Token(t,v,s,e));
  expect(tok).toBeNull();
  expect(stream.getPosition()).toEqual(pos);
});
