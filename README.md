# Zanza

Stuff vscode should have by default.

## Development

- `f5` run / launch another vscode for extension development mode
- `ctrl+r` reload (in another window)

## Known Issues

1. So far all text transforms are done via enumerating/modifying selections,
   meaning text needs to be selected to operate on and inserted text will be selected by default.
2. Clipboard buffer is in memory only.
3. Delete line and move to next line always places the comment to the beginning of the content,
   unlike webstorm, which tries to align it to the previous line's comment placement.

## Keyboard shortcuts

Shortcuts are set for Windows only (so far) - or at least they are tested there.

### Existing (redefined/added)

- `alt+backspace` = Delete Lines (from: _ctrl+shift+k_)
- `ctrl+alt+\` = Single Column Layout / Unsplit All
- `shift+left` = Collapse Folders (in Explorer)
- `ctrl+alt+/` = Toggle Block Comment (from: _alt+shift+a_)

### New

- `ctrl+c` = Copy to Buffer
- `ctrl+shift+v 1` = Paste from Buffer [1]
- `ctrl+shift+v 2` = Paste from Buffer [2]
- `ctrl+shift+v 3` = Paste from Buffer [3]
- `ctrl+shift+v 4` = Paste from Buffer [4]
- `ctrl+shift+v 5` = Paste from Buffer [5]
- `ctrl+shift+v`x2 = Show Clipboard Buffer
- `ctrl+shift+/` Toggle Line Comment, Move Cursor Down
