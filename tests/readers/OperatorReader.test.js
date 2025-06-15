import { CharStream } from "../../src/lexer/CharStream.js";
import { Token } from "../../src/lexer/Token.js";
import { OperatorReader } from "../../src/lexer/OperatorReader.js";

test("OperatorReader reads single and multi-char", () => {
  let stream = new CharStream("== => + -");
  let token = OperatorReader(stream, (type, value, start, end) => new Token(type, value, start, end));
  expect(token.value).toBe("==");
});
