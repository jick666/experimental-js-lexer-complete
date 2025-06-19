import { readPrefixedNumber } from './helpers/readPrefixedNumber.js';

export function OctalReader(stream, factory) {
  return readPrefixedNumber(
    stream,
    factory,
    'oO',
    ch => ch >= '0' && ch <= '7'
  );
}
