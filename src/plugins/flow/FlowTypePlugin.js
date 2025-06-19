export function FlowTypeAnnotationReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== ':') return null;
  let value = ':';
  stream.advance();
  while (stream.current() && /\s/.test(stream.current())) {
    value += stream.current();
    stream.advance();
  }
  while (stream.current() && /[A-Za-z0-9_<>,\s?]/.test(stream.current())) {
    value += stream.current();
    stream.advance();
    if (/\n/.test(stream.current())) break;
  }
  return factory('TYPE_ANNOTATION', value.trimEnd(), start, stream.getPosition());
}

export const FlowTypePlugin = {
  modes: { default: [FlowTypeAnnotationReader] },
  init(engine) {
    const orig = engine.modes.default.filter(r => r !== FlowTypeAnnotationReader);
    engine.modes.default = [FlowTypeAnnotationReader, ...orig];
  }
};
