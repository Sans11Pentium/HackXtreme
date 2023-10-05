"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode_1 = require("vscode");
const palm_1 = require("./palm");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    console.log(`🤖 OptiSync extension is activated!`);
    const langId = vscode_1.window.activeTextEditor?.document.languageId;
    let disposable = vscode_1.commands.registerCommand('optisyncextension.generateDocstring', async () => {
        const editor = vscode_1.window.activeTextEditor;
        const selection = editor?.selection;
        // let text = "def calculate_sum(n):\n    result = 0\n    for i in range(n):\n        result = result + i\n    return result";
        let text = "";
        let insertionLine = 0;
        if (selection && !selection.isEmpty) {
            const selectionRange = new vscode_1.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);
            text = highlighted;
            insertionLine = editor.selection.start.line;
        }
        if (!text || text === undefined || insertionLine === -1) {
            // console.log("YES");
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                return;
            }
            text = editor.document.getText(editor.selection);
            insertionLine = editor.selection.start.line;
        }
        // show progress window and use PaLM to generate docstring
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "OptiSync",
            cancellable: true
        }, async (progress) => {
            progress.report({
                message: `Creating Docstring...`,
            });
            const res = await (0, palm_1.getDocumentation)(text, insertionLine);
        });
    });
    context.subscriptions.push(disposable);
    let disposableCode = vscode_1.commands.registerCommand("optisyncextension.optimiseCode", () => {
        console.log("Optimise");
        const editor = vscode_1.window.activeTextEditor;
        const selection = editor?.selection;
        // let text = "def calculate_sum(n):\n    result = 0\n    for i in range(n):\n        result = result + i\n    return result";
        let text = "";
        let insertionLine = 0;
        if (selection && !selection.isEmpty) {
            const selectionRange = new vscode_1.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            const highlighted = editor.document.getText(selectionRange);
            console.log(highlighted);
            text = highlighted;
            insertionLine = editor.selection.start.line;
        }
        if (!text || text === undefined || insertionLine === -1) {
            // console.log("YES");
            const editor = vscode_1.window.activeTextEditor;
            if (!editor) {
                return;
            }
            text = editor.document.getText(editor.selection);
            insertionLine = editor.selection.start.line;
        }
        // show progress window and use PaLM to generate docstring
        vscode_1.window.withProgress({
            location: vscode_1.ProgressLocation.Notification,
            title: "OptiSync",
            cancellable: true
        }, async (progress) => {
            progress.report({
                message: `Optimising Code...`,
            });
            const res = await (0, palm_1.getOptimisedCode)(text, insertionLine);
        });
    });
    context.subscriptions.push(disposableCode);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map