# Zanza

Stuff vscode should have by default.

No dependencies, no hacks, no wishlists, no magic.

The [list of commands can be found here](./docs/commands.md).

## Development

- `f5` run / launch another vscode for extension development mode
- `ctrl+r` reload (in another window)

Adding a new command:

- add new command file in _src/_ and import it in _src/extension.ts_
- add new command in _packageJson/_ AND _packageJson/build.js_
- change `version` in _package.json_
- update vsce `npm install -D @vscode/vsce@X.Y.Z` (with proper version)
- `npm run build` (even before launching the extension dev mode)

Adding new icons:

- see svg files in _./icons_
- edit _./icons/zanza-icon-theme.json_

## Known Issues

1. So far all text transforms are done via enumerating/modifying selections,
   meaning text needs to be selected to operate on and inserted text will be selected by default.
2. Clipboard buffer is in memory only.
3. Delete line and move to next line always places the comment to the beginning of the content,
   unlike webstorm, which tries to align it to the previous line's comment placement.
4. Boomarks are static (if you remove or add a line, the value will NOT change).
5. Peafowl colors are stored in .vscode workspace settings, vscode has no API
   to store them in memory or outside the workspace specific _settings.json_.

## Keyboard shortcuts

Shortcuts are set for Windows only (so far) - or at least they are tested there.

### Existing (redefined/added)

- `alt+backspace` = Delete Lines (from: _ctrl+shift+k_)
- `ctrl+alt+\` = Single Column Layout / Unsplit All
- `shift+left` = Collapse Folders (in Explorer sidebar)
- `ctrl+alt+/` = Toggle Block Comment (from: _alt+shift+a_)
- `ctrl+alt+left` // `ctrl+shift+left` = Terminal Previous
- `ctrl+alt+right` // `ctrl+shift+right` = Terminal Next
- `alt+insert` = New File (Explorer Sidebar)
- `shift+alt+insert`: New Folder (Explorer Sidebar)
- `shift+alt+t` = Wrap with Abbreviation
- `ctrl+shift+j` // `cmd+shift+j` = Join Lines
- `ctrl+k shift+w` // `cmd+k shift+w` = Close All Other Tabs
- `ctrl+alt+t` = Toggle Tabbar Visibility
- `ctrl+alt+up` = Maximize Terminal Panel (in Terminal Only)
- `shift+space` = Insert Snippet from List (vscode auto complete can be very slow)
- `ctrl+shift+alt+r` = Restart Ts Server (in case of "phantom" lsp errors)

### New

- `ctrl+c` // `cmd+c` = Copy to Buffer
- `ctrl+x` // `cmd+v` = Cut to Buffer
- `ctrl+shift+v <NUM>` // `cmd+shift+v <NUM>` = Paste from Buffer [<NUM>] (NUM:1-2-3-4-5)
- `ctrl+shift+v`×2 // `cmd+shift+v`×2 = Show Clipboard Buffer
- `ctrl+shift+/` // `cmd+alt+/` = Toggle Line Comment, Move Cursor Down
- `alt+shift+d <NUM>` = Save Bookmark [<NUM>] (NUM:1-2-3-4-|-5-6-7-8); 5-8 is persistent per workspace
- `alt+d <NUM>` = Load Bookmark [<NUM>]
- `alt+d`×2 = Load Bookmark from List
- `alt+shift+d`×2 = Save Bookmark to List
- `ctrl+shift+backspace` // `cmd+shift+backspace` = Greedy Backspace
- `ctrl+f9`= Start Terminal (external)
- `ctrl+shift+f9`= Start Git Bash (external, _git-bash.exe_ must be on the path)
- `ctrl+alt+p`= Quick Open Selection or Clipboard
- `f4`= Close Diff and Open Active File (in diff viewer)
- `explorer context menu / folder`= Open Folder in New Instance
- Color status and titlebar with `Peafowl Color: ...` commands (9 dark, 6 light)
- Sort all or selected lines

## TODO

- [x] generate package.json from json fragments
- [x] persist the bookmarks per workspace
- [x] greedy backspace (see: jasonlhy.hungry-delete)
- [x] open file, name from clipboard or selection (see: quickOpen.withPrefill)
- [x] open folder in new window (context menu)
- [x] jump to file from diff view and close the diff
- [x] simple icon theme based on minimal
- [x] sort all lines
- [x] fix peafowl theme saving if there's no local settings.json
- [ ] reformat comments
- [ ] save list of opened files / reopen them ([API missing](https://github.com/Microsoft/vscode/issues/15178))

## Tips and tricks

### Terminal colors and theme modifications

Currently it's not possible to "inherit from" a theme, one can either clone/dump a full theme and modify
that or one can define override colors in global (or workspace) settings. Here's an example on how to change
the terminal's colors and [fine tune](https://code.visualstudio.com/docs/getstarted/themes#_customizing-a-color-theme)
themes:

```jsonc
"workbench.colorCustomizations": {
    "editorIndentGuide.activeBackground": "#ffffff70",
    "editorIndentGuide.background": "#ffffff15",
    // theme overrides
    "[Solarized Dark]": {
      "editor.background": "#001419"
    },
    "[Tomorrow Night Blue]": {
      "editor.background": "#000d1e"
    },
    "[Default Dark+]": {
      "editor.background": "#181818"
    },
    // terminal (tango colors)
    "terminal.background": "#0d0d0d",
    "terminal.foreground": "#d3d7cf",
    "terminal.ansiBlack": "#000000",
    "terminal.ansiBlue": "#3465a4",
    "terminal.ansiBrightBlack": "#555753",
    "terminal.ansiBrightBlue": "#729fcf",
    "terminal.ansiBrightCyan": "#34e2e2",
    "terminal.ansiBrightGreen": "#8ae234",
    "terminal.ansiBrightMagenta": "#ad7fa8",
    "terminal.ansiBrightRed": "#ef2929",
    "terminal.ansiBrightWhite": "#eeeeec",
    "terminal.ansiBrightYellow": "#fce94f",
    "terminal.ansiCyan": "#06989a",
    "terminal.ansiGreen": "#4e9a06",
    "terminal.ansiMagenta": "#75507b",
    "terminal.ansiRed": "#cc0000",
    "terminal.ansiWhite": "#d3d7cf",
    "terminal.ansiYellow": "#c4a000"
  },
```
