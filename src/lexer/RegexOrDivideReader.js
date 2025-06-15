/**
 * Minimal reader to demonstrate regex mode handling. It does not handle
 * escapes or flags and is intended purely for testing mode transitions.
 */
export function RegexOrDivideReader(stream, factory, engine) {
  const mode = engine.currentMode();
  const startPos = stream.getPosition();
  const ch = stream.current();

  if (mode === 'default') {
    if (ch !== '/') return null;
    stream.advance();
    engine.pushMode('regex');
    const endPos = stream.getPosition();
    return factory('REGEX_START', '/', startPos, endPos);
  }

  if (mode === 'regex') {
    if (ch === '/') {
      stream.advance();
      engine.popMode();
      const endPos = stream.getPosition();
      return factory('REGEX_END', '/', startPos, endPos);
    }
    let value = '';
    while (!stream.eof()) {
      const c = stream.current();
      if (c === '/') break;
      value += c;
      stream.advance();
      if (engine.currentMode() !== 'regex') break;
    }
    const endPos = stream.getPosition();
    return factory('REGEX_BODY', value, startPos, endPos);
  }

  return null;
}
