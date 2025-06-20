// §4.5 RegexOrDivideReader
// Context-sensitive reader: decides whether a “/” starts a RegExp literal or is a divide operator.

function isIdentifierStart(ch) {
  return (
    (ch >= 'A' && ch <= 'Z') ||
    (ch >= 'a' && ch <= 'z') ||
    ch === '_'
  );
}

function isIdentifierPart(ch) {
  return isIdentifierStart(ch) || (ch >= '0' && ch <= '9');
}

import matchProperty from 'unicode-match-property-ecmascript';
import matchPropertyValue from 'unicode-match-property-value-ecmascript';

const WS = new Set([' ', '\n', '\t', '\r', '\v', '\f']);
const regexStarters = new Set([
  '(', '{', '[', '=', ':', ',', ';', '!', '?', '+', '-', '*', '%', '&', '|',
  '^', '~', '<', '>'
]);

function readDivide(stream, factory, startPos) {
  stream.advance(); // consume '/'
  return factory('OPERATOR', '/', startPos, stream.getPosition());
}

function isRegexContext(stream, startPos) {
  let i = startPos.index - 1;
  let prev = null;
  while (i >= 0) {
    const ch = stream.input[i];
    if (WS.has(ch)) { i--; continue; }
    prev = ch;
    break;
  }
  return prev === null || regexStarters.has(prev);
}

function readRegexLiteral(stream, factory, startPos) {
  stream.advance(); // consume opening '/'

  let body = '';
  let escaped = false;
  let charClassDepth = 0;
  while (!stream.eof()) {
    const ch = stream.current();
    if (!escaped) {
      if (ch === '\\') {
        const next = stream.peek();
        if ((next === 'p' || next === 'P') && stream.peek(2) === '{') {
          const sign = next;
          body += '\\' + sign + '{';
          stream.advance();
          stream.advance();
          stream.advance();
          let prop = '';
          while (!stream.eof() && stream.current() !== '}') {
            const c = stream.current();
            if (!/[A-Za-z0-9_=^:-]/.test(c)) {
              const endPos = stream.getPosition();
              return factory('INVALID_REGEX', `/${body}${prop}`, startPos, endPos);
            }
            prop += c;
            body += c;
            stream.advance();
          }
          if (stream.current() !== '}') {
            const endPos = stream.getPosition();
            return factory('INVALID_REGEX', `/${body}${prop}`, startPos, endPos);
          }
          body += '}';
          stream.advance();
          try {
            const expr = prop.startsWith('^') ? prop.slice(1) : prop;
            const sepIndex = expr.indexOf('=') !== -1 ? expr.indexOf('=') : expr.indexOf(':');
            if (sepIndex !== -1) {
              const p = expr.slice(0, sepIndex);
              const v = expr.slice(sepIndex + 1);
              const canonical = matchProperty(p);
              matchPropertyValue(canonical, v);
            } else {
              try {
                matchProperty(expr);
              } catch {
                matchPropertyValue('General_Category', expr);
              }
            }
          } catch {
            const endPos = stream.getPosition();
            return factory('INVALID_REGEX', `/${body}`, startPos, endPos);
          }
          continue;
        } else {
          escaped = true;
          body += ch;
          stream.advance();
          continue;
        }
      }

      if (charClassDepth > 0) {
        if (ch === '[') {
          charClassDepth++;
        } else if (ch === ']') {
          charClassDepth--;
          if (charClassDepth < 0) {
            const endPos = stream.getPosition();
            return factory('INVALID_REGEX', `/${body}`, startPos, endPos);
          }
        }
      } else {
        if (ch === '[') {
          charClassDepth = 1;
        } else if (ch === '/') {
          break;
        } else if (
          ch === '(' &&
          stream.peek() === '?' &&
          stream.peek(2) === '<'
        ) {
          body += ch; // '('
          stream.advance();
          body += stream.current(); // '?'
          stream.advance();
          body += stream.current(); // '<'
          stream.advance();
          if (stream.current() === '=' || stream.current() === '!') {
            body += stream.current();
            stream.advance();
          } else {
            let name = '';
            if (!stream.eof() && isIdentifierStart(stream.current())) {
              while (!stream.eof() && stream.current() !== '>') {
                if (!isIdentifierPart(stream.current())) {
                  const endPos = stream.getPosition();
                  return factory('INVALID_REGEX', `/${body}${name}`, startPos, endPos);
                }
                name += stream.current();
                body += stream.current();
                stream.advance();
              }
            } else {
              const endPos = stream.getPosition();
              return factory('INVALID_REGEX', `/${body}`, startPos, endPos);
            }
            if (stream.current() !== '>') {
              const endPos = stream.getPosition();
              return factory('INVALID_REGEX', `/${body}${name}`, startPos, endPos);
            }
            body += stream.current();
            stream.advance();
          }
          continue;
        }
      }
    } else {
      escaped = false;
    }

    body += ch;
    stream.advance();
  }

  if (charClassDepth !== 0 || stream.current() !== '/') {
    const endPos = stream.getPosition();
    return factory('INVALID_REGEX', `/${body}`, startPos, endPos);
  }

  stream.advance(); // consume closing '/'

  let flags = '';
  while (!stream.eof()) {
    const ch = stream.current();
    const code = ch.charCodeAt(0);
    if (!((code >= 65 && code <= 90) || (code >= 97 && code <= 122))) break;
    flags += ch;
    stream.advance();
  }

  const endPos = stream.getPosition();
  return factory('REGEX', `/${body}/${flags}`, startPos, endPos);
}


export function RegexOrDivideReader(stream, factory) {
  const startPos = stream.getPosition();
  if (stream.current() !== '/') return null;

  if (stream.peek() === '=') {
    stream.advance();
    stream.advance();
    return factory('OPERATOR', '/=', startPos, stream.getPosition());
  }

  if (!isRegexContext(stream, startPos)) {
    return readDivide(stream, factory, startPos);
  }

  return readRegexLiteral(stream, factory, startPos);
}
