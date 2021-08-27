// merges all the json-like js file in this directory
// and injects them into the main package.json
// (somewhat less painful than defining everything in the package.json itself)
// ---------------------------------------------------------------------------
const fs = require('fs');
const output = require('../package.json');
const parts = [
  require('./bookmark'),
  require('./changeCase'),
  require('./clipboardBuffer'),
  require('./commentDown'),
  require('./greedySelect'),
  require('./generic'),
];

const activationEvents = [
  // example:
  // "onCommand:zanza.foobar",
];
const keybindings = [
  // example:
  // {
  //   "key": "alt+backspace",
  //   "command": "editor.action.foobar",
  //   "when": "textInputFocus && !editorReadonly"
  // },
];
const commands = [
  // example:
  // {
  //   "command": "zanza.copyToBuffer",
  //   "title": "Copy to Buffer"
  // },
];

parts.flat().forEach((part) => {
  // activasion event
  activationEvents.push(`onCommand:${part.command}`);
  // keybinding
  if (part.key) {
    const keybinding = {
      command: part.command,
      key: part.key,
    };
    if (part.when) {
      keybinding.when = part.when;
    }
    if (part.mac) {
      keybinding.mac = part.mac;
    }
    keybindings.push(keybinding);
  }
  // command
  if (part.title) {
    commands.push({ command: part.command, title: part.title });
  }
});

const save = (name = '') => fs.writeFileSync(name, JSON.stringify(output, null, 2));
save('package.json.old');
output.activationEvents = activationEvents;
output.contributes.keybindings = keybindings;
output.contributes.commands = commands;
save('package.json');
