import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

const open = (uri: vscode.Uri) => {
  vscode.commands.executeCommand('vscode.openFolder', uri, { forceNewWindow: true });
};

// ---

export function openFolderNewInstanceInitExtension(context: vscode.ExtensionContext) {
  const { registerCommand, registerTextEditorCommand } = vscode.commands;
  // the context menu command, easy as pie
  const action = registerCommand('zanza.openFolderNewInstance', open);

  // but we can add it to the editor as well, why not?
  const addDisposable = getAddDisposable(context);
  addDisposable(
    registerTextEditorCommand('zanza.openFolderNewInstanceFromEditor', (textEditor, edit) => {
      const uri = textEditor.document.uri;
      const location = uri.scheme + ':' + uri.path.replace(/[^/]+$/, '');
      open(vscode.Uri.parse(location, true));
    })
  );

  context.subscriptions.push(action);
}
