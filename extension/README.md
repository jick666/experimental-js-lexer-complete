# Experimental JS Lexer VS Code Extension

This extension exposes the lexer via the `experimental-js-lexer.tokenize` command. The command reads the current editor document, tokenizes it and prints each token to the console.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the extension:
   ```bash
   npm run build
   ```

## Loading the Extension in VS Code

1. Open the `extension/` folder in VS Code.
2. Press `F5` to start a new Extension Development Host instance.
   The compiled extension from `dist/` will be loaded automatically.

## Using the Tokenize Command

With a JavaScript file open in the active editor:

1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`).
2. Run `Experimental JS Lexer: Tokenize Current Document` (command ID `experimental-js-lexer.tokenize`).
   Tokens will be printed to the developer console of the Extension Development Host.

