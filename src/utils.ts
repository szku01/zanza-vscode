import { Disposable, ExtensionContext } from 'vscode';

export const getAddDisposable = (context: ExtensionContext) => (dis: Disposable) => context.subscriptions.push(dis);

export const getPickerSelection = (sel = ''): number => parseInt((sel?.match(/^\[(\d+)]\!?:/) || [])[1] || '-1', 10);
