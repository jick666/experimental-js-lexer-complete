export function DoExpressionReader(stream, factory, engine) {
  const startPos = stream.getPosition();

  const mode = engine.currentMode();

  if (mode === 'do_block') {
    if (stream.current() === '}') {
      stream.advance();
      const endPos = stream.getPosition();
      engine.popMode();
      return factory('DO_BLOCK_END', '}', startPos, endPos);
    }
    // check for nested do blocks within a do block
  }

  // Recognize "do {" at start of expression or statement
  if (mode === 'default' || mode === 'do_block') {
    if (stream.input.startsWith('do', stream.index)) {
      const afterDo = stream.index + 2;
      let idx = afterDo;
      while (/\s/.test(stream.input[idx])) idx++;
      if (stream.input[idx] === '{') {
        // consume 'do'
        stream.advance();
        stream.advance();
        while (/\s/.test(stream.current())) stream.advance();
        // consume '{'
        stream.advance();
        const endPos = stream.getPosition();
        engine.pushMode('do_block');
        return factory('DO_BLOCK_START', 'do {', startPos, endPos);
      }
    }
  }

  return null;
}
