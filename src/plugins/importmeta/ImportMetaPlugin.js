import { ImportMetaReader } from '../../lexer/ImportMetaReader.js';
import { ImportCallReader } from '../../lexer/ImportCallReader.js';

export const ImportMetaPlugin = {
  modes: { default: [ImportMetaReader, ImportCallReader] },
  init(engine) {
    const orig = engine.modes.default.filter(r =>
      r !== ImportMetaReader && r !== ImportCallReader
    );
    engine.modes.default = [ImportMetaReader, ImportCallReader, ...orig];
  }
};
