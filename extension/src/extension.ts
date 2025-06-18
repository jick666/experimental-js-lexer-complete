import * as vscode from 'vscode';
import { createTokenStream } from 'experimental-js-lexer';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('experimental-js-lexer.tokenize', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const stream = createTokenStream(editor.document.getText());
      stream.on('data', (token: any) => console.log(token));
    }
  });
  context.subscriptions.push(disposable);
}

export function deactivate() {}
