const reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
const reHasRegExpChar = RegExp(reRegExpChar.source);
export default function escapeRegExp(string = '') {
  return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, '\\$&') : string || '';
}
