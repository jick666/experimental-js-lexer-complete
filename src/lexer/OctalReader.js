import { isOctalDigit } from './NumericLiteralUtils.js';

export function OctalReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '0') return null;
  const prefix = stream.peek();
  if (prefix !== 'o' && prefix !== 'O') return null;

  let idx = stream.index + 2;
  const ch = stream.input[idx];
  if (ch === undefined || !isOctalDigit(ch)) return null;

  let value = '0' + prefix;
  stream.advance();
  stream.advance();

  while (stream.current() !== null && isOctalDigit(stream.current())) {
    value += stream.current();
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
