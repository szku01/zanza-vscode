interface IPeafowlColorDefinition {
  'statusBar.background': string;
  'statusBar.foreground': string;
  'statusBarItem.hoverBackground': string;
  'statusBarItem.remoteBackground': string;
  'statusBarItem.remoteForeground': string;
  'titleBar.activeBackground': string;
  'titleBar.activeForeground': string;
  'titleBar.inactiveBackground': string;
  'titleBar.inactiveForeground': string;
}

const getDefinition = (bg = '', fg = '', bgHover = ''): IPeafowlColorDefinition => {
  return {
    'statusBar.background': `#${bg}`,
    'statusBar.foreground': `#${fg}`,
    'statusBarItem.hoverBackground': `#${bgHover}`,
    'statusBarItem.remoteBackground': `#${bg}`,
    'statusBarItem.remoteForeground': `#${fg}`,
    'titleBar.activeBackground': `#${bg}`,
    'titleBar.activeForeground': `#${fg}`,
    'titleBar.inactiveBackground': `#${bg}99`,
    'titleBar.inactiveForeground': `#${fg}99`,
  };
};

export default {
  // dark
  dimGray: getDefinition('696969', 'e7e7e7', '828282'),
  teal: getDefinition('008080', 'e7e7e7', '00b3b3'),
  sienna: getDefinition('a0522d', 'e7e7e7', 'c76739'),
  darkRed: getDefinition('8b0000', 'e7e7e7', 'be0000'),
  darkGreen: getDefinition('006400', 'e7e7e7', '009700'),
  darkOliveGreen: getDefinition('556b2f', 'e7e7e7', '718e3f'),
  darkSlateBlue: getDefinition('483d8b', 'e7e7e7', '5a4dae'),
  darkMagenta: getDefinition('8b008b', 'e7e7e7', 'be00be'),
  maroon: getDefinition('800000', 'e7e7e7', 'b30000'),
  // light
  thistle: getDefinition('d8bfd8', '15202b', 'c59fc5'),
  silver: getDefinition('c0c0c0', '15202b', 'a6a6a6'),
  lightGreen: getDefinition('90ee90', '15202b', '64e764'),
  lightSkyBlue: getDefinition('87cefa', '15202b', '56baf8'),
  lightPink: getDefinition('ffb6c1', '15202b', 'ff8396'),
  cornsilk: getDefinition('fff8dc', '15202b', 'ffeea9'),
  // dummy
  dummy: getDefinition('000', '000', '000'),
};
