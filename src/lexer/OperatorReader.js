// §4.3 OperatorReader
import { JavaScriptGrammar } from '../grammar/JavaScriptGrammar.js';

const ops = JavaScriptGrammar.operators
  .slice()
  .sort((a, b) => b.length - a.length);

export function OperatorReader(stream, factory) {
  const startPos = stream.getPosition();
  const rest = stream.input.slice(stream.index);
  for (const op of ops) {
    if (rest.startsWith(op)) {
      // consume
      for (let i = 0; i < op.length; i++) stream.advance();
      const endPos = stream.getPosition();
      return factory('OPERATOR', op, startPos, endPos);
    }
  }
  return null;
}
