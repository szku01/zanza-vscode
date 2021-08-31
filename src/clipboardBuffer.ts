import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

const { clipboard } = vscode.env;
const buffer: string[] = [];
const CLIPBOARD_BUFFER_MAX = 5;

// paste into selections
// (this is NOT the same as a "real" paste, but it's good enough for me)
function paste(s: string, textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  textEditor.selections.forEach((sel) => {
    edit.replace(sel, s);
  });
}

async function addToBuffer() {
  const text = await clipboard.readText();
  buffer.unshift(text);
  if (buffer.length > CLIPBOARD_BUFFER_MAX) {
    buffer.pop();
  }
}

// ---

// copies to the buffer ring with filo
async function copyToBufferAuto() {
  await vscode.commands.executeCommand('editor.action.clipboardCopyAction');
  await addToBuffer();
}

async function cutToBufferAuto() {
  await vscode.commands.executeCommand('editor.action.clipboardCutAction');
  await addToBuffer();
}

// paste from given buffer
async function pasteFromBuffer(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, n = 1) {
  n = n - 1;
  const val = buffer[n];
  if (n >= CLIPBOARD_BUFFER_MAX || val === undefined) {
    return;
  }
  paste(val, textEditor, edit);
}

// shows a quick picker with the clipboard ring, then pastes the selected text
async function showClipboardBuffer(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  if (buffer.length === 0) {
    return;
  }
  const sel = await vscode.window.showQuickPick(
    buffer.map((text, i) => `[${i + 1}]: ${text}`),
    { canPickMany: false }
  );
  if (!sel) {
    return;
  }
  const num = parseInt((sel?.match(/^\[(\d+)]:/) || [])[1] || '1', 10);
  // the passed textEditor can "expire" and we're after the quickPicker's promise
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor) {
    activeTextEditor.edit((editBuilder) => {
      paste(buffer[num - 1], activeTextEditor, editBuilder);
    });
  }
}

// ---

export function clipboardBufferInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);

  addDisposable(vscode.commands.registerTextEditorCommand('zanza.copyToBuffer', () => copyToBufferAuto()));
  addDisposable(vscode.commands.registerTextEditorCommand('zanza.cutToBuffer', () => cutToBufferAuto()));

  for (let i = 1; i < CLIPBOARD_BUFFER_MAX + 1; i++) {
    addDisposable(
      vscode.commands.registerTextEditorCommand(
        `zanza.pasteFromBuffer${i}`,
        (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => pasteFromBuffer(textEditor, edit, i)
      )
    );
  }

  addDisposable(
    vscode.commands.registerTextEditorCommand(
      'zanza.showClipboardBuffer',
      (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => showClipboardBuffer(textEditor, edit)
    )
  );
}
