---
name: "Reader Task"
description: "Implement a specific token reader"
title: "[Reader] {{TOKEN_TYPE}}"
labels: ["reader", "token"]
projects: ["Experimental Lexer"]
---

**Task**  
Implement `{{TOKEN_TYPE}}` reader per spec.

* **Relevant test** – `tests/readers/{{TOKEN_TYPE}}Reader.test.js`  
* **Signature** – `(stream: CharStream, factory: (type,value,start,end) => Token) => Token | null`
