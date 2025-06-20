#!/usr/bin/env node
import { CharStream } from "./src/lexer/CharStream.js";
import { LexerEngine } from "./src/lexer/LexerEngine.js";
import { IncrementalLexer } from "./src/integration/IncrementalLexer.js";
import { BufferedIncrementalLexer } from "./src/integration/BufferedIncrementalLexer.js";
import { createTokenStream, TokenStream } from "./src/integration/TokenStream.js";
import { tokenIterator } from "./src/integration/tokenUtils.js";
import { fileURLToPath } from "url";

/**
 *
 * @param code
 * @param root0
 * @param root0.verbose
 */
export function tokenize(
  code,
  { verbose = false, errorRecovery = false, sourceURL = null } = {}
) {
  const stream = new CharStream(code, { sourceURL });
  const lexer = new LexerEngine(stream, { errorRecovery });
  const tokens = [];
  for (const tok of tokenIterator(lexer)) {
    tokens.push(tok);
    if (verbose) console.log(tok);
  }
  return tokens;
}

export const registerPlugin = LexerEngine.registerPlugin.bind(LexerEngine);
export const clearPlugins = LexerEngine.clearPlugins.bind(LexerEngine);
export { IncrementalLexer, BufferedIncrementalLexer, TokenStream, createTokenStream };

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
