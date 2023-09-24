import * as vscode from 'vscode';
import peafowlColorDefinitions from './peafowlColorDefinitions';
import { clone, getAddDisposable, objectKeys } from './utils';

type TPeaColors = keyof typeof peafowlColorDefinitions;

// this may NOT work with multi-workspaces, but I really don't use that feature, so...
async function peafowlColor(colorSet: TPeaColors | null) {
  const { workspace } = vscode;
  if (!workspace?.workspaceFolders?.length) {
    console.warn('Peafowl colors will only work with workspaces!');
    return;
  }

  // read current config and then modify that
  // (clone is needed because vsc returns a Proxy!)
  const location = 'workbench.colorCustomizations';
  const target = vscode.ConfigurationTarget.Workspace;
  const configProxy = await workspace.getConfiguration();
  const currentConfig = (configProxy.inspect(location)?.workspaceValue ?? {}) as Record<string, string>;
  const colors = peafowlColorDefinitions[colorSet || 'dummy'];

  if (!colorSet) {
    // reset (this will remove whatever colors are there,
    // regardless of who set up them - but I'm fine with that)
    objectKeys(colors).forEach((key) => {
      currentConfig[key] = undefined as any; // delete will NOT work
    });
  } else {
    // set colors
    objectKeys(colors).forEach((key) => {
      currentConfig[key] = colors[key];
    });
  }

  // write to config
  const values = Object.values(currentConfig);
  if (values.length === 0 || values.every((val) => val === undefined)) {
    await configProxy.update(location, undefined, target);
  } else {
    await configProxy.update(location, currentConfig, target);
  }
}

// ---

export function peafowlColorInitExtension(context: vscode.ExtensionContext) {
  const add = getAddDisposable(context);
  const reg = vscode.commands.registerCommand;
  add(reg('zanza.peafowlColorReset', () => peafowlColor(null)));
  add(reg('zanza.peafowlColorDimGray', () => peafowlColor('dimGray')));
  add(reg('zanza.peafowlColorTeal', () => peafowlColor('teal')));
  add(reg('zanza.peafowlColorSienna', () => peafowlColor('sienna')));
  add(reg('zanza.peafowlColorDarkRed', () => peafowlColor('darkRed')));
  add(reg('zanza.peafowlColorDarkGreen', () => peafowlColor('darkGreen')));
  add(reg('zanza.peafowlColorDarkOliveGreen', () => peafowlColor('darkOliveGreen')));
  add(reg('zanza.peafowlColorDarkSlateBlue', () => peafowlColor('darkSlateBlue')));
  add(reg('zanza.peafowlColorDarkMagenta', () => peafowlColor('darkMagenta')));
  add(reg('zanza.peafowlColorMaroon', () => peafowlColor('maroon')));
  add(reg('zanza.peafowlColorThistle', () => peafowlColor('thistle')));
  add(reg('zanza.peafowlColorSilver', () => peafowlColor('silver')));
  add(reg('zanza.peafowlColorLightGreen', () => peafowlColor('lightGreen')));
  add(reg('zanza.peafowlColorLightSkyBlue', () => peafowlColor('lightSkyBlue')));
  add(reg('zanza.peafowlColorLightPink', () => peafowlColor('lightPink')));
  add(reg('zanza.peafowlColorCornsilk', () => peafowlColor('cornsilk')));
}
