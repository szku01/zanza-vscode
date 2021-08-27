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
];
