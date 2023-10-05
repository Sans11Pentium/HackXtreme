"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentation = exports.getOptimisedCode = void 0;
const axios = require('axios');
const vscode_1 = require("vscode");
async function getOptimisedCode(text, insertionLine) {
    if (!text || text === undefined) {
        vscode_1.window.showWarningMessage(`No function found. Please make sure that your cursor is either within a function or is selecting a function.`);
        return;
    }
    const editor = vscode_1.window.activeTextEditor;
    const langId = editor?.document.languageId || 'python';
    const options = {
        method: 'POST',
        url: 'http://127.0.0.1:4000/api/v1/palm/optimiseCode',
        data: { "code": text },
        headers: {
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFjNWM5ZmIxYzJlMTVhMTg5NWZlODkiLCJpYXQiOjE2OTY0MjMyMzJ9.PoJ2RQ3KNBiyq4C44nZuqZ_rkAZCSeKo50lLqBeZ6FM',
        },
    };
    axios
        .request(options)
        .then(function ({ data }) {
        let optimisedCode = data.optimisedCode;
        editor?.edit(editBuilder => {
            const selection = editor?.selection;
            const selectionRange = new vscode_1.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
            editBuilder.replace(selectionRange, optimisedCode);
        });
        vscode_1.window.showInformationMessage(`✅ Generated Optimised Code!`);
    })
        .catch(function (error) {
        console.error(`[PaLMOptimisedCode] error: ${error}`);
        vscode_1.window.showErrorMessage(`ERROR! Could not Optimise Code.\n${error}`);
        return false;
    });
}
exports.getOptimisedCode = getOptimisedCode;
async function getDocumentation(text, insertionLine) {
    if (!text || text === undefined) {
        vscode_1.window.showWarningMessage(`No function found. Please make sure that your cursor is either within a function or is selecting a function.`);
        return;
    }
    const editor = vscode_1.window.activeTextEditor;
    const langId = editor?.document.languageId || 'python';
    const options = {
        method: 'POST',
        url: 'http://127.0.0.1:4000/api/v1/palm/generateDocstring',
        data: { "code": text },
        headers: {
            'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTFjNWM5ZmIxYzJlMTVhMTg5NWZlODkiLCJpYXQiOjE2OTY0MjMyMzJ9.PoJ2RQ3KNBiyq4C44nZuqZ_rkAZCSeKo50lLqBeZ6FM',
        },
    };
    axios
        .request(options)
        .then(function ({ data }) {
        let docstring = data.documentation.replace(/`/g, '');
        editor?.edit(editBuilder => {
            // make sure docstring is added after function signature
            docstring = addDocstringIndentationAndTokens(text, docstring, langId);
            const insertionPoint = new vscode_1.Position(insertionLine, 0);
            console.log(insertionPoint);
            editBuilder.insert(insertionPoint, docstring);
        });
        vscode_1.window.showInformationMessage(`✅ Generated Docstring!`);
    })
        .catch(function (error) {
        console.error(`[PaLMGenerateDocstring] error: ${error}`);
        vscode_1.window.showErrorMessage(`ERROR! Could not generate Docstring.\n${error}`);
        return false;
    });
}
exports.getDocumentation = getDocumentation;
/**
 * Checks if indentation is already present in docstring. If not, adds
 *  indentation to the docstring given.
 * @param docstring
 * @returns docstring with indentation
 */
function addDocstringIndentationAndTokens(text, docstring, langId) {
    const editor = vscode_1.window.activeTextEditor;
    const tabSize = editor?.options.tabSize;
    const insertSpaces = editor?.options.insertSpaces;
    const indentString = insertSpaces ? ' '.repeat(tabSize) : '\t';
    let numIndents = 0;
    if (langId === "python") {
        // [1] COUNT NUMBER OF INDENTS NEEDED
        numIndents = countNumIndents(insertSpaces, tabSize, text);
        // [2] CHECKING IF DOCSTRING ALREADY INCLUDES INDENTATION
        const numIndentsInDocstring = countNumIndents(insertSpaces, tabSize, docstring);
        // console.log(numIndentsInDocstring);
        if (!(numIndentsInDocstring === numIndents)) {
            const numIndentsDiff = numIndents - numIndentsInDocstring;
            if (numIndentsDiff > 0) {
                // docstring does not include (enough) indentation, add it
                var re2 = new RegExp('\\n(?![\n\r])', 'g');
                docstring = docstring.replace(re2, `\n${indentString.repeat(numIndentsDiff)}`);
            }
        }
    }
    // console.log(`numIndents: ${numIndents}`);
    // [4] CONSTRUCTING THE FINAL DOCSTRING
    const startDocstringToken = vscode_1.workspace.getConfiguration("optisync").get(`${langId}.startDocstringToken`) || "'''";
    const endDocstringToken = vscode_1.workspace.getConfiguration("optisync").get(`${langId}.endDocstringToken`) || "'''";
    // insert indents (either tabs or spaces) into each line of the docstring
    // console.log(indentString.repeat(numIndents));
    // console.log(numIndents);
    const newDocstring = indentString.repeat(numIndents) + startDocstringToken
        + '\n' + indentString.repeat(numIndents) + docstring
        + '\n' + indentString.repeat(numIndents) + endDocstringToken + '\n';
    // console.log(newDocstring);
    return newDocstring;
}
/**
 * @returns the number of indents/tabs are needed for the docstring
 */
function countNumIndents(insertSpaces, tabSize, text) {
    // find for the first line of code after function signature
    var pattern = insertSpaces ? `\\n\\s{${tabSize},}` : `\\n\\t+`;
    var re = new RegExp(pattern);
    var match = text.match(re) || [""];
    // count the number of indets in that first line
    let numIndents = 0;
    var spacesCounter = 0;
    if (match.length) {
        for (let i = 0; i < match[0].length; i++) {
            let char = match[0][i];
            if (char === '\t') {
                numIndents += 1;
            }
            else if (char === ' ') {
                spacesCounter += 1;
            }
            if (insertSpaces && spacesCounter === tabSize) {
                numIndents += 1;
                spacesCounter = 0;
            }
        }
    }
    return numIndents;
}
//# sourceMappingURL=palm.js.map