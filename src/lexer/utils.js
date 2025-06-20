export function isDigit(ch) {
  return ch !== null && ch >= '0' && ch <= '9';
}

export function readDigitsWithUnderscores(stream, startPos) {
  let value = '';
  let underscoreSeen = false;
  let lastUnderscore = false;
  let ch = stream.current();
  while (ch !== null && (isDigit(ch) || ch === '_')) {
    if (ch === '_') {
      if (lastUnderscore) {
        stream.setPosition(startPos);
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
  return { value, underscoreSeen, lastUnderscore };
}

export function readDigits(stream) {
  let value = '';
  let ch = stream.current();
  while (isDigit(ch)) {
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  return value;
}

export function readNumberLiteral(stream, startPos, requireFractionDigits = false) {
  let value = readDigits(stream);
  let ch = stream.current();
  if (ch === '.') {
    value += '.';
    stream.advance();
    const digits = readDigits(stream);
    if (digits.length === 0 && requireFractionDigits) {
      stream.setPosition(startPos);
      return null;
    }
    value += digits;
    ch = stream.current();
  }
  return { value, ch };
}

// Consume the given keyword at the current stream position.
// Ensures the keyword is not part of a larger identifier by checking
// preceding and following characters.
// Returns the end position on success or null on failure.
export function consumeKeyword(stream, keyword, { checkPrev = true } = {}) {
  const startPos = stream.getPosition();

  if (checkPrev) {
    const prevIndex = startPos.index - 1;
    const prevChar = prevIndex >= 0 ? stream.input[prevIndex] : null;
    if (prevChar && /[A-Za-z0-9_$]/.test(prevChar)) return null;
  }

  for (const ch of keyword) {
    if (stream.current() !== ch) {
      stream.setPosition(startPos);
      return null;
    }
    stream.advance();
  }

  const next = stream.current();
  if (next && /[A-Za-z0-9_$]/.test(next)) {
    stream.setPosition(startPos);
    return null;
  }

  return stream.getPosition();
}
