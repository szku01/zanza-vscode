import * as vscode from 'vscode';
import { getAddDisposable } from './utils';
import unicodeWords from './lodashInternals/unicodeWords';

// most of this is a copy-paste from lodash 4.0.0 (MIT license)
const hasUnicodeWord = RegExp.prototype.test.bind(/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/);

function asciiWords(s = '') {
  return s.match(/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g); // eslint-disable-line no-control-regex
}

// Splits `string` into an array of its words.
function words(string = '', pattern?: RegExp) {
  if (pattern) {
    return string.match(pattern) || [];
  }
  const result = hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
  return result || [];
}

function capitalize(string = '') {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// ---

export function kebabCase(string = '', concatChar = '-') {
  return (words(string.replace(/['\u2019]/g, '')) as any).reduce(
    (result: string, word: string, index: number) => result + (index ? concatChar : '') + word.toLowerCase(),
    ''
  );
}

export function splitToWords(string = '') {
  return kebabCase(string, ' ');
}

export function sentenceCase(string = '') {
  return capitalize(splitToWords(string));
}

export function sentencePascalCase(string = '') {
  return (words(string.replace(/['\u2019]/g, '')) as any).reduce(
    (result: string, word: string, index: number) => result + (index ? ' ' : '') + capitalize(word.toLowerCase()),
    ''
  );
}

export function camelCase(string = '') {
  return (words(string.replace(/['\u2019]/g, '')) as any).reduce((result: string, word: string, index: number) => {
    word = word.toLowerCase();
    return result + (index ? capitalize(word) : word);
  }, '');
}

export function pascalCase(string = '') {
  return capitalize(camelCase(string));
}

export function snakeCase(string = '', scream = false) {
  const result = (words(string.replace(/['\u2019]/g, '')) as any).reduce(
    (result: string, word: string, index: number) => result + (index ? '_' : '') + word.toLowerCase(),
    ''
  );
  return scream ? result.toUpperCase() : result;
}

export function screamingSnakeCase(string = '') {
  return snakeCase(string, true);
}

// ---

function transformToCase(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit, fn: (s: string) => string) {
  textEditor.selections.forEach((sel) => {
    edit.replace(sel, fn(textEditor.document.getText(sel)));
  });
}

export function changeCaseInitExtension(context: vscode.ExtensionContext) {
  const addDisposable = getAddDisposable(context);
  const { registerTextEditorCommand } = vscode.commands;

  // snake, upper, title, lower - these are already in vscode, but these operate on words separately
  const map = [
    camelCase,
    kebabCase,
    pascalCase,
    snakeCase,
    screamingSnakeCase,
    sentenceCase,
    sentencePascalCase,
    splitToWords,
  ];
  map.forEach((fn) => {
    addDisposable(
      registerTextEditorCommand(`zanza.transformTo${pascalCase(fn.name)}`, (textEditor, edit) =>
        transformToCase(textEditor, edit, fn)
      )
    );
  });
  // alias constant case to screaming snake
  addDisposable(
    registerTextEditorCommand('zanza.transformToConstantCase', (textEditor, edit) =>
      transformToCase(textEditor, edit, screamingSnakeCase)
    )
  );
}
