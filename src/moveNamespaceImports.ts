import * as vscode from 'vscode';
import { getAddDisposable } from './utils';

function moveNamespaceImports(textEditor: vscode.TextEditor) {
  if (!textEditor) return undefined;
  let startLine = 0;
  let endLine = textEditor.document.lineCount - 1;

  let lines: string[] = [];
  for (let i = startLine; i <= endLine; i++) {
    lines.push(textEditor.document.lineAt(i).text);
  }

  let counter = 0;
  const nsImportRex = /^import\s+[a-zA-Z0-9-_]*\s+=\s+[^;]*;$/;
  const afterLines: string[] = [];
  
  const nsLines: string[] = []; // lines with namespace-like imports
  const noNsLines: string[] = []; // every other line (we work only on these)
  lines.forEach((line, i) => {
    if (nsImportRex.test(line)) {
      nsLines.push(line);
    } else {
      noNsLines.push(line);
    }
  });

  let innerLoop = false; // are we inside a multiline import?
  let done = false;
  noNsLines.forEach((line, i) => {
    const trimLine = line.trim().replace(/;\s+\/\/.*$/, ''); // line trimmed and ending comment removed (hopefully)
    if (done) { // we're finished with the imports stuff, the rest probably is code
      afterLines.push(line);
      return;
    }
    if (innerLoop) {
      if (trimLine.includes(' from ') && trimLine.endsWith(';')) {
        innerLoop = false; // multiline imports END
        return;
      } else {
        return; // still in the multiline import
      }
    }
    // empty line or fully commented line
    if (!trimLine || line.startsWith('//') || (trimLine.startsWith('/*') && trimLine.endsWith('*/'))) {
      return; // range comments are a pain, sorry
    }
    // single line real import (`import ... from ...;`)
    if (trimLine.startsWith('import ') && line.includes(' from \'') && line.endsWith(';')) {
      return;
    }
    // `import ...;` (for example `import * as foobar;` or `import 'foobar';`)
    if (trimLine.startsWith('import ') && trimLine.endsWith(';')) {
      return;
    }
    // multi line imports BEGIN
    if (trimLine.startsWith('import ') && trimLine.endsWith('{')) {
      innerLoop = true;
      return;
    }
    if (!done) {
      counter = i;
    }

    // if something doesn't look like an import,
    // then probably we've reached the end of the import section
    done = true;
    afterLines.push(line); // the current line did not look like an importish one, so we must be in the after phase
  });

  const newLines = [
    ...noNsLines.slice(0, counter),
    '',
    ...nsLines,
    '',
    ...afterLines,
  ];
  const mergedText = newLines.join('\n').replace(/\n{3,}/g, '\n\n'); // join all and remove 2+ empty lines

  return textEditor.edit((editBuilder) => {
    const range = new vscode.Range(startLine, 0, endLine, textEditor.document.lineAt(endLine).text.length);
    editBuilder.replace(range, mergedText);
  });
}

// ---

export function moveNamespaceImportsInitExtension(context: vscode.ExtensionContext) {
  const add = getAddDisposable(context);
  const reg = vscode.commands.registerTextEditorCommand;
  // Moves namespace imports to the end of real imports, but since it uses regex and not ast proper
  // this may be a bit flaky; I need this because the organize imports (in the eslint plugin)
  // can't deal with those (see also _multipleCommands.ts_).
  add(reg('zanza.moveNamespaceImports', (textEditor) => moveNamespaceImports(textEditor)));
}
