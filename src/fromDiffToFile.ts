import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

const { clipboard } = vscode.env;

const sleep = (t = 1000) => new Promise((resolve) => setTimeout(resolve, t));

// in storm when I'm in a diff view, I can press f4, which will jump to the file and close the diff
async function fromDiffToFile(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
  // okay, this is mindfuck, but I'm omitting the `await` so this will close (hipefully) AFTER the file jump
  // BUT it will pick up the selection and cursor position data from the current document...
  // (vscode has no api - yet - to close a document without opening it, but even that
  // is kinda complicated when you're doing it in order to just close an existing editor)
  vscode.commands.executeCommand('workbench.action.closeActiveEditor');

  // you can check "git.openFile" and adore it's beauty - and realize how
  // it's much more than "vscode.open" uri, unfortunately I'm not going to replicate that whole thing
  // https://github.com/microsoft/vscode/blob/a10dccc76aaed8d5666796feea2c3c0380970d04/extensions/git/src/commands.ts
  // await vscode.commands.executeCommand('vscode.open', uri);
  await vscode.commands.executeCommand('workbench.view.explorer'); // show the explorer view
  await vscode.commands.executeCommand('git.openFile'); // let it pick up cursor and selection stuff
}

// ---

export function fromDiffToFileInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;

  addDisposable(registerTextEditorCommand('zanza.fromDiffToFile', fromDiffToFile));
}
