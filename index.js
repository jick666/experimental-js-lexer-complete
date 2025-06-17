#!/usr/bin/env node
import { CharStream } from "./src/lexer/CharStream.js";
import { LexerEngine } from "./src/lexer/LexerEngine.js";
import { IncrementalLexer } from "./src/integration/IncrementalLexer.js";
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
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const tok = lexer.nextToken();
    if (tok === null) break;
    tokens.push(tok);
    if (verbose) console.log(tok);
  }
  return tokens;
}

export { IncrementalLexer };

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
