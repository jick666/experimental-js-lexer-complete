/**
 * §4.1 IdentifierReader
 * @param {import("./CharStream.js").CharStream} stream
 * @param {(type:string,value:string,start:Object,end:Object)=>import("./Token.js").Token} factory
 * @returns {import("./Token.js").Token|null}
 *
 * TODO(codex): See docs/LEXER_SPEC.md#readers. Read letters and underscores into IDENTIFIER tokens.
 */
export function IdentifierReader(stream, factory) {
  return null;
}
