import * as vscode from 'vscode';
import escapeRegExp from './lodashInternals/escapeRegExp';
import { getAddDisposable, getPickerSelection } from './utils';

interface IBookmark {
  id: number;
  empty: boolean;
  persist: boolean;
  path: string;
  uri: string;
  line: number;
  character: number;
}

// I used to have 10 items (1...0), but heck, do I need that much?
// (the id to index map _was_ used for moving the first (0) to the last position)
const EXT_KEY = 'zanza.bookmark';
const MAX_BUFFERS = 8;
const MAX_PATH_LENGTH = 50;
const buffer: IBookmark[] = [];
let currentContext: vscode.ExtensionContext;

for (let i = 0; i < MAX_BUFFERS; i++) {
  buffer.push({ id: i + 1, empty: true, uri: '', path: '', line: 0, character: 0, persist: i >= MAX_BUFFERS / 2 });
}

function getPickMap() {
  return buffer.map((item, idx) => {
    const persist = item.persist ? '!' : '';
    const keyId = `[${item.id}]${persist}`;
    if (item.empty) {
      return `${keyId}: -`;
    }
    const parts = item.path.split('/');
    let path = item.path;
    const wsFolders = vscode.workspace.workspaceFolders || [];
    wsFolders.forEach((wsFolder, idx) => {
      const name = wsFolders.length === 1 ? ':' : `w${idx}:`;
      path = path.replace(new RegExp(escapeRegExp(wsFolder.uri.path), 'i'), name);
    });
    let suffix = path.length > MAX_PATH_LENGTH ? '…' + path.substr(MAX_PATH_LENGTH * -1) : path;
    const name = parts[parts.length - 1];
    suffix = suffix.replace(new RegExp(`${escapeRegExp(name)}$`, 'i'), '');
    return `${keyId}: ${name}:${item.line}:${item.character} - <${suffix}>`;
  });
}

async function clearBookmarks() {
  if (!currentContext) return;
  await currentContext.workspaceState.update(EXT_KEY, []);
}

async function storeBookmarks() {
  if (!currentContext) return;
  console.log(1, currentContext.storageUri);
  await currentContext.workspaceState.update(EXT_KEY, buffer);
}

async function restoreBookmarks() {
  if (!currentContext) return;
  const items: IBookmark[] = currentContext.workspaceState.get(EXT_KEY, []);
  items.forEach((item, idx) => {
    if (item.persist) buffer[idx] = item;
  });
}

// MAIN
// ====

async function saveBookmark(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, num: number) {
  const { line, character } = textEditor.selection.active;
  const { path, scheme } = textEditor.document.uri;
  const idx = buffer.findIndex((item) => item.id === num);
  if (idx < 0) return;
  buffer[idx] = {
    ...buffer[idx],
    empty: false,
    path,
    uri: `${scheme}:${path}`,
    line: line,
    character: character,
  };
  await storeBookmarks();
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
  const sel = await vscode.window.showQuickPick(getPickMap(), { canPickMany: false });
  if (!sel) {
    return;
  }
  const num = getPickerSelection(sel);
  const selectedItem = buffer.find((item) => item.id === num);
  if (selectedItem && !selectedItem.empty) {
    await loadBookmark(selectedItem.id);
  }
}

async function saveBookmarkToPicker(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  const sel = await vscode.window.showQuickPick(getPickMap(), { canPickMany: false });
  if (!sel) {
    return;
  }
  await saveBookmark(textEditor, edit, getPickerSelection(sel));
}

async function flushBookmarks() {
  buffer.forEach((item) => (item.empty = true));
  await clearBookmarks();
}

// INIT
// ====

export function bookmarkInitExtension(context: vscode.ExtensionContext) {
  currentContext = context; // such lazy, much ugly
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand, registerCommand } = vscode.commands;
  restoreBookmarks();
  for (let i = 1; i <= buffer.length; i++) {
    addDisposable(
      registerTextEditorCommand(`zanza.saveBookmark${i}`, (textEditor, edit) => saveBookmark(textEditor, edit, i))
    );
    addDisposable(registerCommand(`zanza.loadBookmark${i}`, () => loadBookmark(i)));
  }
  addDisposable(registerCommand('zanza.loadBookmarkFromPicker', loadBookmarkFromPicker));
  addDisposable(registerCommand('zanza.flushBookmarks', flushBookmarks));
  registerTextEditorCommand(`zanza.saveBookmarkToPicker`, (textEditor, edit) => saveBookmarkToPicker(textEditor, edit));
}
