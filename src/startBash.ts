import * as path from 'path';
import { spawn } from 'child_process';
import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

// - TODO test linux and mac!
// - TODO check spaces in folder names?
// - TODO this will fail with non local resources (and possibly with mutliple workspaces)
//        but right now I'm not using any of those...
async function startBash(gitBash = false) {
  const { platform } = process;
  const workspace = vscode.workspace.workspaceFolders;
  const activeEditor = vscode.window.activeTextEditor;
  const fileName = activeEditor?.document.fileName;
  let location = workspace?.[0].uri.fsPath;
  if (!location && fileName) {
    location = path.dirname(fileName);
  }
  let bin = '';
  let args: string[] = [];
  if (platform === 'win32') {
    if (gitBash) {
      bin = 'git-bash.exe';
      args = location ? [`--cd=${location}`] : [];
    } else {
      bin = 'cmd.exe';
      args = location ? ['/K', 'start', 'cd', '/D', location] : [];
    }
  }
  if (platform === 'darwin') {
    bin = 'open';
    args = ['-n', '-a', '/Applications/Utilities/Terminal.app', location || ''].map((x) => x);
  }
  if (platform === 'linux') {
    bin = 'gnome-terminal';
    args = location ? [`--working-directory=${location}`] : [];
  }
  const proc = spawn(bin, args);
  proc.on('error', (error: any) => {
    const missingGitBash = `Failed to start "${bin}"`;
    vscode.window.showErrorMessage(missingGitBash);
    console.error(error);
  });
}

// ---

export function startBashInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerCommand } = vscode.commands;
  addDisposable(registerCommand('zanza.startGitBash', () => startBash(true)));
  addDisposable(registerCommand('zanza.startTerminal', startBash));
}
