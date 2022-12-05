import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

function reverseCompare(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? 1 : -1;
}

function sortLines(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, type: 'asc' | 'desc') {
  if (!textEditor) return undefined;
  const selection = textEditor.selection;
  let startLine = 0;
  let endLine = textEditor.document.lineCount - 1;
  let withSelection = false;

  if (!selection.isEmpty) {
    startLine = selection.start.line;
    endLine = selection.end.line;
    withSelection = true;
  }

  let lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }

  lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  if (type === 'desc') {
    lines.reverse();
  }

  const oldLen = lines.length;
  lines = lines.filter((line) => line.trim());
  const newLen = lines.length;
  const suffix = !withSelection && oldLen > newLen ? '\n' : '';

  return textEditor.edit((editBuilder) => {
    const range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, lines.join('\n') + suffix);
  });
}

// ---

export function sortLinesInitExtension(context: vscode.ExtensionContext) {
  const add = getAddDisposable(context);
  const reg = vscode.commands.registerTextEditorCommand;
  add(reg('zanza.sortLinesAsc', (textEditor, edit) => sortLines(textEditor, edit, 'asc')));
  add(reg('zanza.sortLinesDesc', (textEditor, edit) => sortLines(textEditor, edit, 'desc')));
}
