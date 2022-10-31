import * as vscode from 'vscode';
import * as Parser from 'web-tree-sitter';

const langConfig = {
    c: {},
    javascript: {},
};

class TokenProvider implements vscode.DocumentSemanticTokensProvider, vscode.HoverProvider {
    parser: { [lang: string]: Parser } = {};
    
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    
    provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SemanticTokens> {
        throw new Error('Method not implemented.');
    }
    
    // provideDocumentSemanticTokensEdits?(document: vscode.TextDocument, previousResultId: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SemanticTokens | vscode.SemanticTokensEdits> {
    // 	throw new Error('Method not implemented.');
    // }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        throw new Error('Method not implemented.');
    }
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pandahighlighter" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('pandahighlighter.helloWorld', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World from pandahighlighter!');
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
