module.exports = [
  {
    key: 'alt+backspace',
    command: 'editor.action.deleteLines',
    when: 'textInputFocus && !editorReadonly',
  },
  {
    key: 'ctrl+alt+\\',
    command: 'workbench.action.editorLayoutSingle',
  },
  {
    key: 'shift+left',
    command: 'workbench.files.action.collapseExplorerFolders',
    when: 'explorerViewletFocus && explorerViewletVisible && !inputFocus',
  },
  {
    key: 'ctrl+alt+/',
    when: 'editorTextFocus && !editorReadonly',
    command: 'editor.action.blockComment',
  },
  {
    key: 'ctrl+alt+left',
    command: 'workbench.action.terminal.focusPrevious',
    when: 'terminalFocus && terminalProcessSupported',
  },
  {
    key: 'ctrl+alt+right',
    command: 'workbench.action.terminal.focusNext',
    when: 'terminalFocus && terminalProcessSupported',
  },
  {
    key: 'alt+insert',
    command: 'explorer.newFile',
  },
  {
    key: 'shift+alt+insert',
    command: 'explorer.newFolder',
  },
  {
    key: 'shift+alt+t',
    command: 'editor.emmet.action.wrapWithAbbreviation',
  },
  {
    key: 'ctrl+shift+j',
    command: 'editor.action.joinLines',
    when: 'editorTextFocus',
  },
  {
    key: 'ctrl+k shift+w',
    command: 'workbench.action.closeOtherEditors',
  },
  {
    key: 'ctrl+alt+t',
    command: 'workbench.action.toggleTabsVisibility',
  },
  {
    key: 'ctrl+alt+up',
    command: 'workbench.action.toggleMaximizedPanel',
    when: 'terminalFocus',
  },
  {
    key: 'shift+space',
    command: 'editor.action.insertSnippet',
    when: 'editorTextFocus && !editorReadonly',
  },
  {
    key: 'ctrl+shift+alt+r',
    command: 'typescript.restartTsServer',
  },
];
