#!/usr/bin/env node
import { CharStream } from "./src/lexer/CharStream.js";
import { LexerEngine } from "./src/lexer/LexerEngine.js";

export function tokenize(code, { verbose = false } = {}) {
  const stream = new CharStream(code);
  const lexer = new LexerEngine(stream);
  const tokens = [];
  while (!stream.eof()) {
    const tok = lexer.nextToken();
    tokens.push(tok);
    if (verbose) console.log(tok);
  }
  return tokens;
}

// NOTE: removed CLI guard here. If you want `node index.js` to work,
// you can add a separate `bin.js` that imports `tokenize` and prints.
