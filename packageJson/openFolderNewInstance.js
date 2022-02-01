module.exports = [
  {
    command: 'zanza.openFolderNewInstance',
    title: 'Open Folder in New Instance',
    menu: 'explorer/context',
    group: 'navigation@100',
    when: 'explorerResourceIsFolder',
    skipCommandPalette: true,
  },
  {
    command: 'zanza.openFolderNewInstanceFromEditor',
    title: 'Open Folder in New Instance',
  },
];
