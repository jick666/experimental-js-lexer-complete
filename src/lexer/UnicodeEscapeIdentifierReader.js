const ID_START_RE = /[\p{ID_Start}\p{Math}\p{Emoji}$_]/u;
const ID_CONTINUE_RE = /[\p{ID_Continue}\p{Math}\p{Emoji}$_\u200C\u200D]/u;

function readUnicodeEscape(stream) {
  const startPos = stream.getPosition();
  if (stream.current() !== '\\' || stream.peek() !== 'u') return null;
  stream.advance(); // '\\'
  stream.advance(); // 'u'

  let codePoint = 0;
  if (stream.current() === '{') {
    stream.advance();
    let digits = '';
    while (!stream.eof() && /[0-9a-fA-F]/.test(stream.current())) {
      digits += stream.current();
      stream.advance();
    }
    if (stream.current() !== '}' || digits.length === 0 || digits.length > 6) {
      stream.setPosition(startPos);
      return null;
    }
    stream.advance(); // consume '}'
    codePoint = parseInt(digits, 16);
  } else {
    let digits = '';
    for (let i = 0; i < 4; i++) {
      const ch = stream.current();
      if (!/[0-9a-fA-F]/.test(ch)) {
        stream.setPosition(startPos);
        return null;
      }
      digits += ch;
      stream.advance();
    }
    codePoint = parseInt(digits, 16);
  }
  return String.fromCodePoint(codePoint);
}

export function UnicodeEscapeIdentifierReader(stream, factory) {
  const startPos = stream.getPosition();
  const first = readUnicodeEscape(stream);
  if (!first || !ID_START_RE.test(first)) {
    if (first) stream.setPosition(startPos);
    return null;
  }
  let value = first;
  let ch = stream.current();
  while (ch !== null) {
    if (ch === '\\' && stream.peek() === 'u') {
      const escStart = stream.getPosition();
      const cp = readUnicodeEscape(stream);
      if (!cp || !ID_CONTINUE_RE.test(cp)) {
        stream.setPosition(escStart);
        break;
      }
      value += cp;
      ch = stream.current();
      continue;
    }
    if (!ID_CONTINUE_RE.test(ch)) break;
    value += ch;
    stream.advance();
    ch = stream.current();
  }
  const endPos = stream.getPosition();
  return factory('IDENTIFIER', value, startPos, endPos);
}
