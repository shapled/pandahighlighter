import * as path from 'path';
import * as vscode from 'vscode';
import * as Parser from 'web-tree-sitter';

const supportedLangConfig = {
    bash: {},
    c: {},
    cpp: {},
    go: {},
    javascript: {},
    lua: {},
    ocaml: {},
    ocamlInterface: {},
    php: {},
    python: {},
    ruby: {},
    rust: {},
    typescript: {},
    tsx: {},
};

const parserDir = path.join(__dirname, "parsers");

const legend = new vscode.SemanticTokensLegend(
    ["type", "namespace", "function", "variable", "number", "string",
            "comment", "macro", "keyword", "operator", "punctuation"],
    ["readonly", "defaultLibrary", "modification"]);

class TokenProvider implements vscode.DocumentSemanticTokensProvider, vscode.HoverProvider {
    static parsers: { [lang: string]: Parser } = {};
    
    // onDidChangeSemanticTokens?: vscode.Event<void> | undefined;
    
    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        const lang = document.languageId;
        if (!(lang in TokenProvider.parsers)) {
            const parser = new Parser();
            parser.setLanguage(await Parser.Language.load(path.join(parserDir, `${lang}.wasm`)));
            TokenProvider.parsers[lang] = parser;
        }
        const parser = TokenProvider.parsers[lang];
        const tree = parser.parse(document.getText());
        const builder = new vscode.SemanticTokensBuilder(legend);
        const cursor = tree.walk();
    walk:
        while (true) {
            console.log(cursor.nodeText);

            if (cursor.gotoFirstChild()) {
                continue;
            }

            while (!cursor.gotoNextSibling()) {
                if (!cursor.gotoParent()) {
                    break walk;
                }
            }
        }

        return builder.build();
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
    const enabledLangs: string[] | undefined = vscode.workspace.getConfiguration("panda").get("languages");

    const supportedLangs: {language: string}[] = [];
    Object.keys(supportedLangConfig).forEach(lang => {
        if (!enabledLangs || enabledLangs.includes(lang)) {
            supportedLangs.push({language: lang});
        }
    });

    const engine = new TokenProvider();
    context.subscriptions.push(
        vscode.languages.registerDocumentSemanticTokensProvider(
            supportedLangs, engine, legend));

    console.log(123);
}

// This method is called when your extension is deactivated
export function deactivate() {}
