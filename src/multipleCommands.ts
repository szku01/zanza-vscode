import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms));

async function lintFormat(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  // `typescript.organizeImports` has been removed and `typescript.removeUnusedImports` is not enough
  await vscode.commands.executeCommand('editor.action.organizeImports');
  await sleep(500);
  await vscode.commands.executeCommand('editor.action.formatDocument');
  await vscode.commands.executeCommand('eslint.executeAutofix');
  await vscode.commands.executeCommand('editor.action.formatDocument');
}

// An alternate version to test if it works, using my own import mover.
async function lintFormatAlternate(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  await vscode.commands.executeCommand('zanza.moveNamespaceImports');
  await vscode.commands.executeCommand('editor.action.formatDocument');
  await vscode.commands.executeCommand('eslint.executeAutofix');
  await vscode.commands.executeCommand('editor.action.formatDocument');
}

// ---

export function multipleCommandsInitExtension(context: vscode.ExtensionContext) {
  const add = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;
  add(registerTextEditorCommand('zanza.multiCommandLintFormat', (textEditor, edit) => lintFormat(textEditor, edit)));
  add(registerTextEditorCommand('zanza.multiCommandLintFormatAlternate', (textEditor, edit) => lintFormatAlternate(textEditor, edit)));
}
