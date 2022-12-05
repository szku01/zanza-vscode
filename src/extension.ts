import * as vscode from 'vscode';
import { bookmarkInitExtension } from './bookmark';
import { changeCaseInitExtension } from './changeCase';
import { clipboardBufferInitExtension } from './clipboardBuffer';
import { openSelectionInitExtension } from './openSelection';
import { commentDownInitExtension } from './commentDown';
import { greedySelectInitExtension } from './greedySelect';
import { startBashInitExtension } from './startBash';
import { openFolderNewInstanceInitExtension } from './openFolderNewInstance';
import { fromDiffToFileInitExtension } from './fromDiffToFile';
import { peafowlColorInitExtension } from './peafowlColor';
import { sortLinesInitExtension } from './sortLines';

// will init lazily
export function activate(context: vscode.ExtensionContext) {
  console.info('Zanza is now active!');
  clipboardBufferInitExtension(context);
  changeCaseInitExtension(context);
  commentDownInitExtension(context);
  openSelectionInitExtension(context);
  bookmarkInitExtension(context);
  greedySelectInitExtension(context);
  startBashInitExtension(context);
  openFolderNewInstanceInitExtension(context);
  fromDiffToFileInitExtension(context);
  peafowlColorInitExtension(context);
  sortLinesInitExtension(context);
}

export function deactivate() {}
