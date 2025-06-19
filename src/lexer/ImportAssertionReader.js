export function ImportAssertionReader(stream, factory) {
  const startPos = stream.getPosition();
  if (!stream.input.startsWith('assert', stream.index)) return null;

  // consume 'assert'
  let value = '';
  for (const ch of 'assert') {
    if (stream.current() !== ch) {
      stream.setPosition(startPos);
      return null;
    }
    value += ch;
    stream.advance();
  }

  // require whitespace or ':' or '{' to avoid matching longer identifiers
  const next = stream.current();
  if (next !== ':' && next !== '{' && !(/\s/.test(next))) {
    stream.setPosition(startPos);
    return null;
  }

  // whitespace after 'assert'
  while (!stream.eof() && /\s/.test(stream.current())) {
    value += stream.current();
    stream.advance();
  }

  // optional ':'
  if (stream.current() === ':') {
    value += ':';
    stream.advance();
    while (!stream.eof() && /\s/.test(stream.current())) {
      value += stream.current();
      stream.advance();
    }
  }

  if (stream.current() !== '{') {
    stream.setPosition(startPos);
    return null;
  }

  value += '{';
  stream.advance();
  let depth = 1;
  let inString = null;
  while (!stream.eof() && depth > 0) {
    const ch = stream.current();
    value += ch;
    stream.advance();

    if (inString) {
      if (ch === '\\') {
        if (!stream.eof()) {
          value += stream.current();
          stream.advance();
        }
        continue;
      }
      if (ch === inString) {
        inString = null;
      }
      continue;
    } else {
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = ch;
        continue;
      }
      if (ch === '{') depth++;
      else if (ch === '}') depth--;
    }
  }

  if (depth !== 0) {
    stream.setPosition(startPos);
    return null;
  }

  const endPos = stream.getPosition();
  return factory('IMPORT_ASSERTION', value, startPos, endPos);
}
