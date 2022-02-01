# Zanza

Stuff vscode should have by default.

No dependencies, no hacks, no wishlists, no magic.

## Development

- `f5` run / launch another vscode for extension development mode
- `ctrl+r` reload (in another window)

Adding a new command:

- add new command file in _src/_ and import it in _src/extension.ts_
- add new command in _packageJson/_ AND _packageJson/build.js_
- change `version` in _package.json_
- `npm run build`

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
- `shift+left` = Collapse Folders (in Explorer sidebar)
- `ctrl+alt+/` = Toggle Block Comment (from: _alt+shift+a_)
- `ctrl+alt+left` = Terminal Previous
- `ctrl+alt+right` = Terminal Next
- `alt+insert` = New File (Explorer Sidebar)
- `shift+alt+insert`: New Folder (Explorer Sidebar)
- `shift+alt+t` = Wrap with Abbreviation
- `ctrl+shift+j` = Join Lines
- `ctrl+k shift+w` = Close All Other Tabs
- `ctrl+alt+t` = Toggle Tabbar Visibility
- `ctrl+alt+up` = Maximize Terminal Panel (in Terminal Only)
- `shift+space` = Insert Snippet from List (vscode auto complete can be very slow)
- `ctrl+shift+alt+r` = Restart Ts Server (in case of "phantom" lsp errors)

### New

- `ctrl+c` = Copy to Buffer
- `ctrl+x` = Cut to Buffer
- `ctrl+shift+v <NUM>` = Paste from Buffer [<NUM>] (NUM:1-2-3-4-5)
- `ctrl+shift+v`x2 = Show Clipboard Buffer
- `ctrl+shift+/` = Toggle Line Comment, Move Cursor Down
- `alt+shift+d <NUM>` = Save Bookmark [<NUM>] (NUM:1-2-3-4-|-5-6-7-8); 5-8 is persistent per workspace
- `alt+d <NUM>` = Load Bookmark [<NUM>]
- `alt+d`x2 = Load Bookmark from List
- `alt+shift+d`x2 = Save Bookmark to List
- `ctrl+shift+backspace`x2 = Greedy Backspace
- `ctrl+f9`= Start Terminal (external)
- `ctrl+shift+f9`= Start Git Bash (external)
- `ctrl+alt+p`= Quick Open Selection or Clipboard
- `explorer context menu / folder`= Open Folder in New Instance

## TODO

- [x] generate package.json from json fragments
- [x] persist the bookmarks per workspace
- [x] greedy backspace (see: jasonlhy.hungry-delete)
- [x] open file, name from clipboard or selection (see: quickOpen.withPrefill)
- [x] open folder in new window (context menu)
- [ ] jump to file from diff view and close the diff
- [ ] save list of opened files / reopen them ([API missing](https://github.com/Microsoft/vscode/issues/15178))
