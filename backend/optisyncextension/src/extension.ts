// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, Disposable, window, languages, workspace, ProgressLocation, Range, Position, ExtensionContext } from "vscode";
import { getDocumentation, getOptimisedCode } from './palm';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  	console.log(`🤖 OptiSync extension is activated!`);

	const langId = window.activeTextEditor?.document.languageId;

	let disposable = commands.registerCommand('optisyncextension.generateDocstring', async () => {
		const editor = window.activeTextEditor;
		const selection = editor?.selection;

		// let text = "def calculate_sum(n):\n    result = 0\n    for i in range(n):\n        result = result + i\n    return result";
		let text = "";
		let insertionLine = 0;

		if (selection && !selection.isEmpty) {
			const selectionRange = new Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			const highlighted = editor.document.getText(selectionRange);
			text = highlighted;
			insertionLine = editor.selection.start.line;
		}

		if (!text || text === undefined || insertionLine === -1) {
			// console.log("YES");
			const editor = window.activeTextEditor;
			if (!editor) { return; }
			text = editor.document.getText(editor.selection);
			insertionLine = editor.selection.start.line;
		}

		// show progress window and use PaLM to generate docstring
		window.withProgress(
			{
				location: ProgressLocation.Notification,
				title: "OptiSync",
				cancellable: true
			}, async (progress) => {
				progress.report({
					message: `Creating Docstring...`,
				});
				const res = await getDocumentation(text, insertionLine);
			}
		);
	});

	context.subscriptions.push(disposable);

	let disposableCode = commands.registerCommand("optisyncextension.optimiseCode", () => {
		console.log("Optimise");
		const editor = window.activeTextEditor;
		const selection = editor?.selection;

		// let text = "def calculate_sum(n):\n    result = 0\n    for i in range(n):\n        result = result + i\n    return result";
		let text = "";
		let insertionLine = 0;

		if (selection && !selection.isEmpty) {
			const selectionRange = new Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
			const highlighted = editor.document.getText(selectionRange);
			console.log(highlighted);
			text = highlighted;
			insertionLine = editor.selection.start.line;
		}

		if (!text || text === undefined || insertionLine === -1) {
			// console.log("YES");
			const editor = window.activeTextEditor;
			if (!editor) { return; }
			text = editor.document.getText(editor.selection);
			insertionLine = editor.selection.start.line;
		}

		// show progress window and use PaLM to generate docstring
		window.withProgress(
			{
				location: ProgressLocation.Notification,
				title: "OptiSync",
				cancellable: true
			}, async (progress) => {
				progress.report({
					message: `Optimising Code...`,
				});
				const res = await getOptimisedCode(text, insertionLine);
			}
		);
	});
	context.subscriptions.push(disposableCode);
}

// This method is called when your extension is deactivated
export function deactivate() {}
