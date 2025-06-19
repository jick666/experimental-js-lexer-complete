export function DoExpressionReader(stream, factory, engine) {
  const startPos = stream.getPosition();

  // Handle closing brace when inside a do block
  if (engine && engine.currentMode && engine.currentMode() === 'do_block') {
    if (stream.current() === '}') {
      stream.advance();
      const endPos = stream.getPosition();
      if (engine.popMode) engine.popMode();
      return factory('DO_BLOCK_END', '}', startPos, endPos);
    }
  }

  // Detect "do {" to start a block
  if (stream.current() === 'd' && stream.peek() === 'o') {
    let offset = 2;
    const after = stream.peek(offset);
    if (after === null) return null;
    if (/\s/.test(after) || after === '{') {
      // look ahead through whitespace
      while (/\s/.test(stream.peek(offset))) offset++;
      if (stream.peek(offset) === '{') {
        let value = 'do';
        stream.advance();
        stream.advance();
        while (/\s/.test(stream.current())) {
          value += stream.current();
          stream.advance();
        }
        value += '{';
        stream.advance();
        const endPos = stream.getPosition();
        if (engine && engine.pushMode) engine.pushMode('do_block');
        return factory('DO_BLOCK_START', value, startPos, endPos);
      }
    }
  }

  return null;
}
