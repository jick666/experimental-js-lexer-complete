export class TokenReader {
  read(_stream, _factory, _engine) {
    throw new Error('read() must be implemented');
  }
}

export function runReader(reader, stream, factory, engine) {
  if (typeof reader === 'function') {
    return reader(stream, factory, engine);
  }
  if (reader && typeof reader.read === 'function') {
    return reader.read(stream, factory, engine);
  }
  throw new TypeError('Invalid reader');
}
