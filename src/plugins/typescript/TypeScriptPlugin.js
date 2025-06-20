import { TSDecoratorReader } from '../common/TSDecoratorReader.js';
import { createTypeAnnotationReader } from '../common/TypeAnnotationReader.js';

export const TSTypeAnnotationReader = createTypeAnnotationReader();

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
