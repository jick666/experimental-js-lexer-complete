# Experimental JS Lexer VS Code Extension

This folder contains a simple VS Code extension that exposes the `experimental-js-lexer.tokenize` command. The extension will tokenize the contents of the active editor and log each token to the console.

## Installation

1. Open this `extension` folder in your terminal.
2. Install the dependencies:

   ```bash
   npm install
   ```
3. Compile the extension:

   ```bash
   npm run build
   ```

## Loading the Extension in VS Code

1. Open the `extension` folder in VS Code.
2. Press `F5` or choose **Run > Start Debugging** to launch a new Extension Development Host window. This will load the compiled extension.

## Running the Tokenize Command

With the extension loaded:

1. Open a JavaScript file in the Extension Development Host window.
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the Command Palette.
3. Run **Experimental JS Lexer: Tokenize Current Document** (`experimental-js-lexer.tokenize`).
4. Tokens will be printed to the developer tools console of the Extension Development Host window.

