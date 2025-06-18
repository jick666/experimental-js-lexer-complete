# Plugin API

The lexer supports runtime plugins that can register additional token readers.
A plugin is an object with an optional `modes` map and an `init` function.

```javascript
export function HashReader(stream, factory) {
  const start = stream.getPosition();
  if (stream.current() === '#') {
    stream.advance();
    return factory('HASH', '#', start, stream.getPosition());
  }
  return null;
}

export const HashPlugin = {
  modes: {
    default: [HashReader]
  },
  init(engine) {
    // custom setup logic
  }
};
```

Register the plugin before constructing a lexer:

```javascript
import { registerPlugin, tokenize } from 'experimental-js-lexer';
import { HashPlugin } from './hash-plugin.js';

registerPlugin(HashPlugin);
const tokens = tokenize('#');
```

Use `clearPlugins()` to remove all registered plugins, typically in tests.
