import * as vscode from 'vscode';
import { stat } from 'fs/promises';
import { exec } from 'child_process';
import { getAddDisposable } from './utils';

// vscode has a file api these days, but it would need Uri as a param and as long
// as I'm not working with non-file documents (remotes), I couldn't care less
async function fileExists(fn: string): Promise<boolean> {
  try {
    await stat(fn);
    return true;
  } catch {
    return false;
  }
}

/** Returns the OS's default open program name (lik xdg-open on linux). */
function getCliOpen() {
  const { platform } = process;
  if (platform === 'darwin') return 'open';
  if (platform === 'win32') return 'start';
  return 'xdg-open';
}

function normalizePath(loc: string) {
  return loc.replace(/\\/g, '/').replace(/\/$/, '').replace(/^\//, '');
}

function splitPathToFragments(loc: string) {
  return normalizePath(loc).split('/');
}

function getFirstPathFragment(loc: string) {
  return splitPathToFragments(loc)[0];
}

function getParentPathFragment(loc: string) {
  const parts = splitPathToFragments(loc);
  return parts[parts.length - 2];
}

function withoutLastPathFragment(loc: string) {
  const parts = splitPathToFragments(loc);
  return parts.slice(0, parts.length - 1).join('/');
}

function withoutFirstPathFragment(loc: string) {
  const parts = splitPathToFragments(loc);
  return parts.slice(1).join('/');
}

/**
 * Tries to find the /coverage dir; accepts a path split by '/' for fragments
 * ("c:/foo/bar" -> ['c:', 'foo', 'bar'])
 */
async function findCovDir(nameOfCovDir: string, fragments: string[]) {
  let foundDir = '';
  for (let idx = 0; idx < fragments.length; idx++) {
    const element = fragments[idx];
    const upPath = fragments.slice(0, fragments.length - idx).join('/') + '/' + nameOfCovDir;
    const exists = await fileExists(upPath);
    if (exists) {
      foundDir = upPath;
      break;
    }
  }
  return foundDir;
}

async function openInBrowser(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit): Promise<void> {
  const uri = textEditor.document.uri;
  // Uri for example:
  // "fsPath": "c:\\Users\\szabi\\Projects\\personal\\zanza-vscode\\playground\\dummy.ts",
  // "external": "file:///c%3A/Users/szabi/Projects/personal/zanza-vscode/playground/dummy.ts",
  // "path": "/c:/Users/szabi/Projects/personal/zanza-vscode/playground/dummy.ts",
  // "scheme": "file"

  if (uri.scheme !== 'file') {
    console.warn('Not a file.'); // will this trigger on remotes fine?
    return;
  }

  // let's go up on the directory chain and find the first "coverage" directory
  // (well, if it's outside the project path then... so it goes)
  const fsPath = uri.fsPath.replace(/\\/g, '/');
  const origFileName = normalizePath(fsPath);
  const fragments = fsPath.split('/');
  fragments.length = fragments.length - 1; // cut away the filename
  const coverageDirNames = ['tscoverage', 'coverage']; // everyone sane would use coverage, but not us of course
  let foundDir = '';
  for (let idx = 0; idx < coverageDirNames.length; idx++) {
    const dirName = coverageDirNames[idx];
    foundDir = await findCovDir(dirName, fragments);
    if (foundDir) break;
  }

  if (!foundDir) {
    console.warn('Coverage dir not found up the path.');
    return;
  }

  // considering how "coverage" dir is usually next to the covered directory (eg. "src")
  // we can try to find that (hopefully called "src")
  const maybeRoot = withoutLastPathFragment(foundDir);
  const rest = fragments.join('/').replace(maybeRoot, '');
  const srcDirName = getFirstPathFragment(rest);
  if (!srcDirName) {
    console.warn('Src dir not found (root of the source code for which the coverage was run).');
  }

  // now, here we have two examples:
  // (1)
  // a NG-cli default:
  // FILE: c:/Users/szabi/Projects/sandbox/myAngularApp/my-angular-app/src/app/components/foo-angular/foo-angular.component.ts
  // COV:  c:/Users/szabi/Projects/sandbox/myAngularApp/my-angular-app/coverage/my-angular-app/app/components/foo-angular/foo-angular.component.ts.html
  // (2)
  // a CRA default:
  // FILE: c:/Users/szabi/Projects/sandbox/myAngularApp/my-react-app/src/Foo/Foo.js
  // COV:  c:/Users/szabi/Projects/sandbox/myAngularApp/my-react-app/coverage/lcov-report/src/Foo/Foo.js.html

  // We can brute force these two situations; currently at work I use Angular anyway.
  // Angular coverage first root is the name of the parent (then it is followed by parent (project?) name);
  // React coverage first root is "lcov-report" (then it is followed by the src dir name).

  const origFnWithoutPrjRoot = origFileName.replace(/\.spec\./, '.').replace(maybeRoot, '').replace(/^\//, '');
  const pathA =
    [foundDir, getParentPathFragment(foundDir), origFnWithoutPrjRoot.replace(srcDirName + '/', '')];
  const pathB = [foundDir, 'lcov-report', origFnWithoutPrjRoot];
  let covHtmlsArr = [pathA, pathB];

  // and now we have a third, where src is NOT added right after the /coverage/
  const pathC = [foundDir, withoutFirstPathFragment(origFnWithoutPrjRoot)];
  covHtmlsArr.push(pathC);

  const covHtmls = covHtmlsArr.map(parts => parts.join('/') + '.html');
  let foundHtml = '';
  for (let idx = 0; idx < covHtmls.length; idx++) {
    const html = covHtmls[idx];
    const exists = await fileExists(html);
    if (exists) {
      foundHtml = html;
      break;
    }
  }
  if (!foundHtml) {
    console.info('Was looking for cov html files at:\n' + JSON.stringify(covHtmls, null, 2));
    console.warn('...but neither html file was found!');
    return;
  }
  console.info('Opening HTML: ' + foundHtml);
  exec(getCliOpen() + ' ' + foundHtml);
}

export function coverageInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;

  addDisposable(
    registerTextEditorCommand('zanza.coverageOpenInBrowser', (textEditor, edit) => openInBrowser(textEditor, edit))
  );
}
