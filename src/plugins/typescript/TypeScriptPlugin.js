export function TSDecoratorReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== '@') return null;
  let value = '@';
  stream.advance();
  while (stream.current() && /[A-Za-z0-9_$]/.test(stream.current())) {
    value += stream.current();
    stream.advance();
  }
  return factory('DECORATOR', value, start, stream.getPosition());
}

export function TSTypeAnnotationReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== ':') return null;
  let value = ':';
  stream.advance();
  // Consume whitespace after colon
  while (stream.current() && /\s/.test(stream.current())) {
    value += stream.current();
    stream.advance();
  }
  // Simple identifier or generic form
  while (stream.current() && /[A-Za-z0-9_<>,\s]/.test(stream.current())) {
    value += stream.current();
    stream.advance();
    // stop at line break
    if (/\n/.test(stream.current())) break;
  }
  return factory('TYPE_ANNOTATION', value.trimEnd(), start, stream.getPosition());
}

export function TSGenericParameterReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== '<') return null;
  // Avoid JSX mode when TypeScript plugin is active
  let value = '<';
  stream.advance();
  let depth = 1;
  while (!stream.eof()) {
    const ch = stream.current();
    value += ch;
    stream.advance();
    if (ch === '<') depth++;
    else if (ch === '>') {
      depth--;
      if (depth === 0) break;
    }
  }
  return factory('TYPE_PARAMETER', value, start, stream.getPosition());
}

export const TypeScriptPlugin = {
  modes: {
    default: [TSDecoratorReader, TSTypeAnnotationReader, TSGenericParameterReader]
  },
  init(engine) {
    engine.disableJsx = true;
    const orig = engine.modes.default.filter(r =>
      r !== TSDecoratorReader &&
      r !== TSTypeAnnotationReader &&
      r !== TSGenericParameterReader
    );
    engine.modes.default = [
      TSDecoratorReader,
      TSTypeAnnotationReader,
      TSGenericParameterReader,
      ...orig
    ];
  }
};
