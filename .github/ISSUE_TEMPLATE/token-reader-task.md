---
name: 'Reader Task'
about: 'Implement a specific token reader'
title: '[Reader] {{TOKEN_TYPE}}'
labels: reader, token
projects: Experimental Lexer - To do
---

**Task**: Implement `{{TOKEN_TYPE}}` reader per spec.  
**Related test**: `tests/readers/{{TOKEN_TYPE}}Reader.test.js`  
**Signature**: `(stream: CharStream, factory: (type, value, start, end) => Token) => Token|null`