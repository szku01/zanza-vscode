import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

async function lintFormat(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  await vscode.commands.executeCommand('editor.action.organizeImports'); // `typescript.organizeImports` has been removed
  await vscode.commands.executeCommand('editor.action.formatDocument');
  await vscode.commands.executeCommand('eslint.executeAutofix');
  await vscode.commands.executeCommand('editor.action.formatDocument');
}

// ---

export function multipleCommandsInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;

  addDisposable(
    registerTextEditorCommand('zanza.multiCommandLintFormat', (textEditor, edit) => lintFormat(textEditor, edit))
  );
}
