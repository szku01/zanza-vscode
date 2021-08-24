import { Disposable, ExtensionContext } from 'vscode';

export const getAddDisposable = (context: ExtensionContext) => (dis: Disposable) => context.subscriptions.push(dis);
