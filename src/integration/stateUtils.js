export function serializeEngine(engine) {
  return {
    stateStack: [...engine.stateStack],
    buffer: engine.buffer.map(t => t.toJSON()),
    disableJsx: engine.disableJsx,
    lastToken: engine.lastToken ? engine.lastToken.toJSON() : null,
    errorRecovery: engine.errorRecovery
  };
}

export function deserializeEngine(engine, data, Token) {
  engine.stateStack = [...data.stateStack];
  engine.buffer = data.buffer.map(
    t => new Token(t.type, t.value, t.start, t.end, t.sourceURL)
  );
  engine.disableJsx = data.disableJsx;
  engine.lastToken = data.lastToken
    ? new Token(
        data.lastToken.type,
        data.lastToken.value,
        data.lastToken.start,
        data.lastToken.end,
        data.lastToken.sourceURL
      )
    : null;
  engine.errorRecovery = data.errorRecovery;
}

export function saveState(instance, includeTrivia = false) {
  return {
    input: instance.stream.input,
    sourceURL: instance.stream.sourceURL,
    position: instance.stream.getPosition(),
    tokens: instance.tokens.map(t => t.toJSON()),
    ...(includeTrivia ? { trivia: instance.trivia.map(t => t.toJSON()) } : {}),
    engine: serializeEngine(instance.engine)
  };
}

export function restoreState(instance, state, includeTrivia = false) {
  const { CharStream, LexerEngine, Token } = instance._deps;
  instance.stream = new CharStream(state.input, { sourceURL: state.sourceURL });
  instance.stream.setPosition(state.position);
  instance.engine = new LexerEngine(instance.stream, { errorRecovery: state.engine.errorRecovery });
  deserializeEngine(instance.engine, state.engine, Token);
  instance.tokens = state.tokens.map(t => new Token(t.type, t.value, t.start, t.end, t.sourceURL));
  if (includeTrivia) {
    instance.trivia = state.trivia.map(t => new Token(t.type, t.value, t.start, t.end, t.sourceURL));
  }
}
