// §4.2 NumberReader
export function NumberReader(stream, factory) {
  const startPos = stream.getPosition();
  let ch = stream.current();
  if (!/\d/.test(ch)) return null;

  function readDigits(regex) {
    let result = '';
    let c = stream.current();
    if (c === '_' || c === null || !regex.test(c)) return null;
    while (c !== null && (regex.test(c) || c === '_')) {
      if (c === '_') {
        if (result === '' || result[result.length - 1] === '_' || !regex.test(stream.peek())) {
          return null;
        }
      }
      result += c;
      stream.advance();
      c = stream.current();
    }
    if (result.endsWith('_')) return null;
    return result;
  }

  let value = '';

  if (ch === '0') {
    const next = stream.peek();
    if (next === 'x' || next === 'X') {
      value = '0' + next;
      stream.advance();
      stream.advance();
      const digits = readDigits(/[0-9a-fA-F]/);
      if (digits === null) { stream.setPosition(startPos); return null; }
      value += digits;
      const endPos = stream.getPosition();
      return factory('NUMBER', value, startPos, endPos);
    }
    if (next === 'o' || next === 'O') {
      value = '0' + next;
      stream.advance();
      stream.advance();
      const digits = readDigits(/[0-7]/);
      if (digits === null) { stream.setPosition(startPos); return null; }
      value += digits;
      const endPos = stream.getPosition();
      return factory('NUMBER', value, startPos, endPos);
    }
    if (next === 'b' || next === 'B') {
      value = '0' + next;
      stream.advance();
      stream.advance();
      const digits = readDigits(/[01]/);
      if (digits === null) { stream.setPosition(startPos); return null; }
      value += digits;
      const endPos = stream.getPosition();
      return factory('NUMBER', value, startPos, endPos);
    }
  }

  const intPart = readDigits(/\d/);
  if (intPart === null) { stream.setPosition(startPos); return null; }
  value += intPart;

  ch = stream.current();
  if (ch === '.') {
    value += '.';
    stream.advance();
    const frac = readDigits(/\d/);
    if (frac === null) { stream.setPosition(startPos); return null; }
    value += frac;
    ch = stream.current();
  }

  if (ch === 'e' || ch === 'E') {
    value += ch;
    stream.advance();
    ch = stream.current();
    if (ch === '+' || ch === '-') {
      value += ch;
      stream.advance();
    }
    const exp = readDigits(/\d/);
    if (exp === null) { stream.setPosition(startPos); return null; }
    value += exp;
  }

  const endPos = stream.getPosition();
  return factory('NUMBER', value, startPos, endPos);
}
