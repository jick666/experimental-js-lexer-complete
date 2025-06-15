/**
 * Basic template string reader supporting start, content and end tokens.
 * Mode transitions are handled via the passed lexer engine.
 */
export function TemplateStringReader(stream, factory, engine) {
  const mode = engine.currentMode();
  const startPos = stream.getPosition();
  const ch = stream.current();

  if (mode === 'default') {
    if (ch !== '`') return null;
    stream.advance();
    engine.pushMode('template_string');
    const endPos = stream.getPosition();
    return factory('TEMPLATE_START', '`', startPos, endPos);
  }

  if (mode === 'template_string') {
    if (ch === '`') {
      stream.advance();
      engine.popMode();
      const endPos = stream.getPosition();
      return factory('TEMPLATE_END', '`', startPos, endPos);
    }
    let value = '';
    while (!stream.eof()) {
      const c = stream.current();
      if (c === '`') break;
      value += c;
      stream.advance();
      if (engine.currentMode() !== 'template_string') break;
    }
    const endPos = stream.getPosition();
    return factory('TEMPLATE_CHARS', value, startPos, endPos);
  }

  return null;
}
