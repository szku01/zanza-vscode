import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

const { clipboard } = vscode.env;

async function openSelection(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  // let's try to use the selections (but if all of them are the same, then don't join them)
  const selectedTexts = textEditor.selections.map((sel) => textEditor.document.getText(sel).trim());
  let text = selectedTexts.every((sel) => sel === selectedTexts[0]) ? selectedTexts[0] : selectedTexts.join('');
  // if we have no selection, then fall back to the clipboard
  // (max 128 char, in case we have smg huge there)
  if (!text) {
    text = await clipboard.readText();
    text = String(text).substring(0, 128).trim();
  }
  vscode.commands.executeCommand('workbench.action.quickOpen', text);
}

// ---

export function openSelectionInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;

  addDisposable(
    registerTextEditorCommand('zanza.openSelection', (textEditor, edit) => openSelection(textEditor, edit))
  );
}
