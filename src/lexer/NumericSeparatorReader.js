import { isDigit } from './NumericLiteralUtils.js';

export function NumericSeparatorReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!isDigit(ch)) return null;

  let value = '';
  let underscoreSeen = false;
  let lastUnderscore = false;

  while (ch !== null && (isDigit(ch) || ch === '_')) {
    if (ch === '_') {
      if (lastUnderscore) {
        stream.index = startPos.index;
        return null;
      }
      underscoreSeen = true;
      lastUnderscore = true;
    } else {
      lastUnderscore = false;
    }

    value += ch;
    stream.advance();
    ch = stream.current();
  }

  if (!underscoreSeen || lastUnderscore) {
    stream.index = startPos.index;
    return null;
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
