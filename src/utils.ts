/* eslint-disable @typescript-eslint/ban-types */
import { Disposable, ExtensionContext } from 'vscode';

export const getAddDisposable = (context: ExtensionContext) => (dis: Disposable) => context.subscriptions.push(dis);

export const getPickerSelection = (sel = ''): number => parseInt((sel?.match(/^\[(\d+)]!?:/) || [])[1] || '-1', 10);

export const objectKeys = Object.keys as <T extends object>(obj: T) => (keyof T)[];

export const clone = (obj: object) => JSON.parse(JSON.stringify(obj));
