#!/usr/bin/env node
import { fileURLToPath } from 'url';
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

// reliably detect CLI invocation:
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input   = process.argv[2] || "";
  const verbose = process.argv.includes("--verbose");
  try {
    console.log(tokenize(input, { verbose }));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
