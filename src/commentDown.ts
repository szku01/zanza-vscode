import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

async function commentDown(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  const positions: vscode.Position[] = [];
  const newPositions: vscode.Selection[] = [];
  textEditor.selections.forEach((sel) => {
    positions.push(sel.active);
  });
  await vscode.commands.executeCommand('editor.action.commentLine');
  positions.forEach((pos) => {
    const newPos = new vscode.Position(pos.line + 1, pos.character);
    newPositions.push(new vscode.Selection(newPos, newPos));
  });
  textEditor.selections = newPositions;
}

// ---

export function commentDownInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;

  addDisposable(registerTextEditorCommand('zanza.commentDown', (textEditor, edit) => commentDown(textEditor, edit)));
}
