import * as vscode from 'vscode';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getAddDisposable } from './utils';

const EXCLUDED_EXTENSIONS = [
  '.7z',
  '.arj',
  '.avi',
  '.bin',
  '.class',
  '.dat',
  '.db',
  '.dll',
  '.dylib',
  '.eot',
  '.exe',
  '.gz',
  '.jar',
  '.lib',
  '.mov',
  '.mp3',
  '.mp4',
  '.o',
  '.obj',
  '.otf',
  '.pdb',
  '.pdf',
  '.pyc',
  '.pyo',
  '.rar',
  '.so',
  '.sqlite',
  '.tar',
  '.ttf',
  '.wav',
  '.webp',
  '.woff',
  '.woff2',
  '.zip',
];

const isExcluded = (filePath: string): boolean => EXCLUDED_EXTENSIONS.includes(path.extname(filePath).toLowerCase());

const cleanLine = (line: string): string =>
  line
    .trim()
    .replace(/^(['"])(.*)\1$/, '$2')
    .trim();

const isFile = (filePath: string): boolean => {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
};

function resolveFilePath(filename: string, baseDirectories: string[]): string | undefined {
  const cleaned = cleanLine(filename);
  if (!cleaned) return undefined;
  const candidates = cleaned.startsWith('file://') // Support absolute paths and file:// URIs.
    ? [vscode.Uri.parse(cleaned).fsPath]
    : path.isAbsolute(cleaned)
      ? [path.resolve(cleaned)]
      : baseDirectories.map((base) => path.resolve(base, cleaned));
  for (const candidate of candidates) {
    if (isExcluded(candidate)) continue;
    if (isFile(candidate)) return candidate;
  }
  return undefined;
}

async function openFiles(lines: string[], baseDirectories: string[]): Promise<void> {
  const opened = new Set<string>();
  let skipped = 0;
  for (const line of lines) {
    const filePath = resolveFilePath(line, baseDirectories);
    if (!filePath) {
      if (line.trim()) {
        skipped++;
      }
      continue;
    }
    const normalized = path.normalize(filePath);
    if (opened.has(normalized)) continue;
    opened.add(normalized);
    try {
      const document = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
      await vscode.window.showTextDocument(document, { preview: false });
    } catch {
      skipped++;
    }
  }
  vscode.window.showInformationMessage(
    `Opened ${opened.size} file(s). Skipped ${skipped} invalid, missing, or excluded line(s).`,
  );
}

function getCurrentFileDirectory(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  return !editor || editor.document.isUntitled ? undefined : path.dirname(editor.document.uri.fsPath);
}

// ---

async function copyOpenFilePaths() {
  const paths = Array.from(vscode.window.tabGroups.all)
    .flatMap((group) => group.tabs)
    .filter((tab): tab is vscode.Tab & { input: vscode.TabInputText } => tab.input instanceof vscode.TabInputText)
    .map((tab) => tab.input.uri.fsPath);
  await vscode.env.clipboard.writeText(paths.join('\n'));
  vscode.window.showInformationMessage(`Copied ${paths.length} open file path(s) to clipboard.`);
}

async function openFilesFromClipboard() {
  const clipboard = await vscode.env.clipboard.readText();
  const currentDirectory = getCurrentFileDirectory();
  const workspaceDirectories = (vscode.workspace.workspaceFolders ?? []).map((folder) => folder.uri.fsPath);
  // Relative paths are tried against the active file first, then against each workspace folder.
  const baseDirectories = [...(currentDirectory ? [currentDirectory] : []), ...workspaceDirectories];
  await openFiles(clipboard.split(/\r?\n/), baseDirectories);
}

async function openFilesFromCurrentFile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.isUntitled) {
    vscode.window.showWarningMessage('Open a saved file first.');
    return;
  }
  const directory = path.dirname(editor.document.uri.fsPath);
  const selection = editor.selection;
  const text = selection.isEmpty ? editor.document.getText() : editor.document.getText(selection);
  await openFiles(text.split(/\r?\n/), [directory]);
}

// ---

export function copyOpenFilePathsInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerCommand } = vscode.commands;
  addDisposable(registerCommand('zanza.copyOpenFilePaths', copyOpenFilePaths));
  addDisposable(registerCommand('zanza.openFilesFromClipboard', openFilesFromClipboard));
  addDisposable(registerCommand('zanza.openFilesFromCurrentFile', openFilesFromCurrentFile));
}
