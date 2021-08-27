import * as vscode from 'vscode';
import { bookmarkInitExtension } from './bookmark';
import { changeCaseInitExtension } from './changeCase';
import { clipboardBufferInitExtension } from './clipboardBuffer';
import { commentDownInitExtension } from './commentDown';
import { greedySelectInitExtension } from './greedySelect';

// will init lazily
export function activate(context: vscode.ExtensionContext) {
  console.log('Zanza is now active!');
  clipboardBufferInitExtension(context);
  changeCaseInitExtension(context);
  commentDownInitExtension(context);
  bookmarkInitExtension(context);
  greedySelectInitExtension(context);
}

export function deactivate() {}
