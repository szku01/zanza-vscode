module.exports = [
  {
    when: 'editorTextFocus && !editorReadonly',
    command: 'zanza.coverageOpenInBrowser',
    title: 'Open Existing Coverage HTML in Browser',
    description:
      'tries to open an istanbul coverage report for the currently open file, hopefully works with the default angular and react setups',
  },
];
