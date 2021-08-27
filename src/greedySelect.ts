import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

async function greedySelectLeft(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  await vscode.commands.executeCommand('cursorUpSelect');
  await vscode.commands.executeCommand('cursorEndSelect');
}

async function greedyDeleteLeft(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  await vscode.commands.executeCommand('cursorUpSelect');
  await vscode.commands.executeCommand('cursorEndSelect');
  await vscode.commands.executeCommand('deleteLeft');
}

// ---

export function greedySelectInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;
  addDisposable(
    registerTextEditorCommand('zanza.greedySelectLeft', (textEditor, edit) => greedySelectLeft(textEditor, edit))
  );
  addDisposable(
    registerTextEditorCommand('zanza.greedyDeleteLeft', (textEditor, edit) => greedyDeleteLeft(textEditor, edit))
  );
}
