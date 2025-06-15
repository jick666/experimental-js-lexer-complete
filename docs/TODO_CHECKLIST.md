### 1. CharStream (§1)
- [x] `current()`
- [x] `peek(offset)`
- [x] `advance()`
- [x] `eof()`
- [x] `getPosition()`

### 2. Token (§2)
- [x] constructor stores `type`,`value`,`start`,`end`
- [x] `toJSON()`

### 3. LexerEngine (§3)
- [ ] initialize `stateStack`  
- [ ] dispatch readers by mode  
- [ ] `nextToken()` fallback + EOF

### 4. IdentifierReader (§4.1)
- [ ] letters & underscores → `IDENTIFIER`

### 5. NumberReader (§4.2)
- [ ] digits with optional `.` → `NUMBER`

### 6. OperatorReader (§4.3)
- [ ] single & multi-char → `OPERATOR`

### 7. PunctuationReader (§4.4)
- [ ] punctuation chars → `PUNCTUATION`

### 8. RegexOrDivideReader (§4.5)
- [ ] context-sensitive regex vs `/` → `REGEX` or `DIVIDE`

### 9. TemplateStringReader (§4.6)
- [ ] backticks, `${}` embedded → `TEMPLATE_STRING`

### 10. WhitespaceReader (§4.7)
- [ ] skip whitespace, attach trivia

### 11. Integration & Tooling
- [ ] `index.js` CLI  
- [ ] `.eslintrc.json` (§8)  
- [ ] CI workflow (`.github/workflows/ci.yml`)
