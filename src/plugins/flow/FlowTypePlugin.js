import { createTypeAnnotationReader } from '../common/TypeAnnotationReader.js';

export const FlowTypeAnnotationReader = createTypeAnnotationReader({
  allowQuestionMark: true
});

export const FlowTypePlugin = {
  modes: { default: [FlowTypeAnnotationReader] },
  init(engine) {
    const orig = engine.modes.default.filter(r => r !== FlowTypeAnnotationReader);
    engine.modes.default = [FlowTypeAnnotationReader, ...orig];
  }
};
