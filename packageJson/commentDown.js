module.exports = [
  {
    key: 'ctrl+shift+/',
    mac: 'cmd+alt+/',
    when: 'editorTextFocus && !editorReadonly',
    command: 'zanza.commentDown',
    title: 'Toggle Line Comment, Move Cursor Down',
  },
];
