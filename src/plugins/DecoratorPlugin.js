export function TSDecoratorReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() !== '@') return null;
  let val = '@';
  stream.advance();
  while (stream.current() && /[A-Za-z0-9_$]/.test(stream.current())) {
    val += stream.current();
    stream.advance();
  }
  return factory('DECORATOR', val, start, stream.getPosition());
}

export const DecoratorPlugin = {
  modes: { default: [TSDecoratorReader] },
  init() {
    // plugin hook for future engine tweaks
  }
};
