import { readPrefixedNumber } from './helpers/readPrefixedNumber.js';

export function HexReader(stream, factory) {
  return readPrefixedNumber(
    stream,
    factory,
    'xX',
    ch =>
      ch !== null &&
      ((ch >= '0' && ch <= '9') ||
        (ch >= 'a' && ch <= 'f') ||
        (ch >= 'A' && ch <= 'F'))
  );
}
