// JavaScript grammar definitions
export const JavaScriptGrammar = {
  keywords: [
    "break","case","catch","class","const","continue","debugger","default","delete","do","else",
    "export","extends","finally","for","function","if","import","in","instanceof","new","return",
    "super","switch","this","throw","try","typeof","var","void","while","with","yield"
  ],
  operators: [
    "+","-","*","/","%","++","--","=","+=","-=","*=","/=","%=","==","===","!=","!==",
    ">","<",">=","<=","&&","||","!","?","...","=>"
  ],
  punctuation: ["{","}","(",")","[","]",".",";",","],
  patterns: {
    identifier: /^[A-Za-z_][A-Za-z0-9_]*/,
    number: /^\d+(\.\d+)?/,
    whitespace: /^\s+/
  }
};
