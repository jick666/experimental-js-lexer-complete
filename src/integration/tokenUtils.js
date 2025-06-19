export function* tokenIterator(engine) {
  let trivia = [];
  let prev = null;
  while (true) {
    const tok = engine.nextToken();
    if (tok === null) {
      if (prev) prev.trivia.trailing = trivia;
      return;
    }
    if (tok.type === 'WHITESPACE') {
      trivia.push(tok);
      continue;
    }
    tok.trivia.leading = trivia;
    if (prev) prev.trivia.trailing = trivia;
    trivia = [];
    prev = tok;
    yield tok;
  }
}
