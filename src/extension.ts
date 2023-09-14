import * as vscode from 'vscode';
import { bookmarkInitExtension } from './bookmark';
import { changeCaseInitExtension } from './changeCase';
import { clipboardBufferInitExtension } from './clipboardBuffer';
import { commentDownInitExtension } from './commentDown';
import { fromDiffToFileInitExtension } from './fromDiffToFile';
import { greedySelectInitExtension } from './greedySelect';
import { multipleCommandsInitExtension } from './multipleCommands';
import { openFolderNewInstanceInitExtension } from './openFolderNewInstance';
import { openSelectionInitExtension } from './openSelection';
import { peafowlColorInitExtension } from './peafowlColor';
import { sortLinesInitExtension } from './sortLines';
import { startBashInitExtension } from './startBash';

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
  multipleCommandsInitExtension(context);
}

export function deactivate() {}
