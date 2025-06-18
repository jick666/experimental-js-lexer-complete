# VS Code Integration Example

This snippet demonstrates how to consume the lexer output using the
`createTokenStream` helper. Tokens are streamed in real time and can be
forwarded to the VS Code semantic highlighting API.

```javascript
import { createTokenStream } from 'experimental-js-lexer';

export function provideDocumentSemanticTokens(text) {
  return new Promise((resolve) => {
    const tokens = [];
    const stream = createTokenStream(text);
    stream.on('data', token => {
      // map token.type to VS Code Semantic Token legends
      tokens.push(token);
    });
    stream.on('end', () => resolve(tokens));
  });
}
```
