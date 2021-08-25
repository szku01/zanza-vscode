import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

interface IBookmark {
  id: number;
  empty: boolean;
  path: string;
  uri: string;
  line: number;
  character: number;
}

// buffers ids are aligned with the us eng keyboard: 1234567890
const MAX_BUFFERS = 10;
const MAX_PATH_LENGTH = 50;
const buffer: IBookmark[] = [];
for (let i = 0; i < MAX_BUFFERS; i++) {
  buffer.push({ id: i === MAX_BUFFERS - 1 ? 0 : i + 1, empty: true, uri: '', path: '', line: 0, character: 0 });
}

async function saveBookmark(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, num: number) {
  const { line, character } = textEditor.selection.active;
  const { path, scheme } = textEditor.document.uri;
  const idx = buffer.findIndex((item) => item.id === num);
  buffer[idx] = {
    ...buffer[idx],
    empty: false,
    path,
    uri: `${scheme}:${path}`,
    line: line,
    character: character,
  };
}

async function loadBookmark(num: number) {
  const item = buffer.find((item) => item.id === num);
  if (!item || item.empty) {
    return;
  }
  const uri = vscode.Uri.parse(item.uri, true);
  const textDocument = await vscode.workspace.openTextDocument(uri);
  const activeEditor = await vscode.window.showTextDocument(textDocument);
  activeEditor.selection = new vscode.Selection(item.line, item.character, item.line, item.character);
}

async function loadBookmarkFromPicker() {
  const map = buffer.map((item) => {
    if (item.empty) {
      return `[${item.id}]: -`;
    }
    // TODO remove workspace location from path if possible
    const parts = item.path.split('/');
    const suffix = item.path.length > MAX_PATH_LENGTH ? '…' + item.path.substr(MAX_PATH_LENGTH * -1) : item.path;
    const name = parts[parts.length - 1];
    return `[${item.id}]: ${name}:${item.line}:${item.character} - (${suffix})`;
  });
  const sel = await vscode.window.showQuickPick(map, { canPickMany: false });
  if (!sel) {
    return;
  }
  const num = parseInt((sel?.match(/^\[(\d+)]:/) || [])[1] || '1', 10);
  const selectedItem = buffer.find((item) => item.id === num);
  if (selectedItem && !selectedItem.empty) {
    await loadBookmark(selectedItem.id);
  }
}

// TODO save to picker
// TODO persist bookmarks 6-7-8-9-0

// ---

export function bookmarkInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand, registerCommand } = vscode.commands;

  for (let i = 0; i < buffer.length; i++) {
    addDisposable(
      registerTextEditorCommand(`zanza.saveBookmark${i}`, (textEditor, edit) => saveBookmark(textEditor, edit, i))
    );
    addDisposable(registerCommand(`zanza.loadBookmark${i}`, () => loadBookmark(i)));
  }
  addDisposable(registerCommand('zanza.loadBookmarkFromPicker', loadBookmarkFromPicker));
}
