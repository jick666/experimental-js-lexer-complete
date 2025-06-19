#!/usr/bin/env node
import { CharStream } from "./src/lexer/CharStream.js";
import { LexerEngine } from "./src/lexer/LexerEngine.js";
import { IncrementalLexer } from "./src/integration/IncrementalLexer.js";
import { BufferedIncrementalLexer } from "./src/integration/BufferedIncrementalLexer.js";
import { createTokenStream } from "./src/integration/TokenStream.js";
import { fileURLToPath } from "url";

/**
 *
 * @param code
 * @param root0
 * @param root0.verbose
 */
export function tokenize(code, { verbose = false } = {}) {
  const stream = new CharStream(code);
  const lexer = new LexerEngine(stream);
  const tokens = [];
  let trivia = [];
  let prev = null;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const tok = lexer.nextToken();
    if (tok === null) break;
    if (tok.type === 'WHITESPACE') {
      trivia.push(tok);
      continue;
    }
    tok.trivia.leading = trivia;
    if (prev) prev.trivia.trailing = trivia;
    trivia = [];
    tokens.push(tok);
    prev = tok;
    if (verbose) console.log(tok);
  }
  if (prev) prev.trivia.trailing = trivia;
  return tokens;
}

export const registerPlugin = LexerEngine.registerPlugin.bind(LexerEngine);
export const clearPlugins = LexerEngine.clearPlugins.bind(LexerEngine);
export { IncrementalLexer, BufferedIncrementalLexer, createTokenStream };

// Only run CLI when invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const input = process.argv[2] || "";
  const verbose = process.argv.includes("--verbose");
  try {
    console.log(tokenize(input, { verbose }));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
