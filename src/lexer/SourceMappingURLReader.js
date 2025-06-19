export function SourceMappingURLReader(stream, factory) {
  const startPos = stream.getPosition();
  const patterns = [
    '//# sourceMappingURL=',
    '//@ sourceMappingURL=',
    '/*# sourceMappingURL=',
    '/*@ sourceMappingURL='
  ];
  for (const p of patterns) {
    if (stream.input.startsWith(p, stream.index)) {
      const isBlock = p.startsWith('/*');
      for (let i = 0; i < p.length; i++) {
        stream.advance();
      }
      let value = '';
      if (isBlock) {
        while (!stream.eof()) {
          if (stream.current() === '*' && stream.peek() === '/') {
            break;
          }
          value += stream.current();
          stream.advance();
        }
        if (stream.current() === '*' && stream.peek() === '/') {
          stream.advance();
          stream.advance();
        }
      } else {
        while (!stream.eof() && stream.current() !== '\n') {
          value += stream.current();
          stream.advance();
        }
      }
      const endPos = stream.getPosition();
      return factory('SOURCE_MAPPING_URL', value.trim(), startPos, endPos);
    }
  }
  return null;
}
