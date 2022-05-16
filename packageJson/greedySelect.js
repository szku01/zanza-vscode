module.exports = [
  {
    key: 'ctrl+shift+backspace',
    mac: 'cmd+shift+backspace',
    when: 'editorTextFocus && !editorReadonly',
    command: 'zanza.greedyDeleteLeft',
    title: 'Greedy Delete Left',
  },
];
