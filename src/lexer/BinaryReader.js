// src/lexer/BinaryReader.js

/**
 * §4.4 BinaryReader
 * Parses binary integer literals like 0b1010 or 0B0101.
 */
import { readPrefixedNumber } from './helpers/readPrefixedNumber.js';

export function BinaryReader(stream, factory) {
  return readPrefixedNumber(
    stream,
    factory,
    'bB',
    ch => ch === '0' || ch === '1'
  );
}
