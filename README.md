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
4. Boomarks are static (if you remove or add a line, the value will NOT change).

## Keyboard shortcuts

Shortcuts are set for Windows only (so far) - or at least they are tested there.

### Existing (redefined/added)

- `alt+backspace` = Delete Lines (from: _ctrl+shift+k_)
- `ctrl+alt+\` = Single Column Layout / Unsplit All
- `shift+left` = Collapse Folders (in Explorer)
- `ctrl+alt+/` = Toggle Block Comment (from: _alt+shift+a_)

### New

- `ctrl+c` = Copy to Buffer
- `ctrl+shift+v <NUM>` = Paste from Buffer [<NUM>] (NUM:1-2-3-4-5)
- `ctrl+shift+v`x2 = Show Clipboard Buffer
- `ctrl+shift+/` = Toggle Line Comment, Move Cursor Down
- `alt+shift+d <NUM>` = Save Bookmark [<NUM>] (NUM:1-2-3-4-|-5-6-7-8);
  the second half is persistent per workspace
- `alt+d <NUM>` = Load Bookmark [<NUM>]
- `alt+d`x2 = Load Bookmark from List
- `alt+shift+d`x2 = Save Bookmark to List
- `ctrl+shift+backspace`x2 = Greedy Backspace

## TODO

- [x] generate package.json from json fragments
- [ ] persist the bookmarks per workspace
