module.exports = [
  {
    command: 'zanza.transformToCamelCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Camel Case (fooBar)',
  },
  {
    command: 'zanza.transformToKebabCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Kebab Case (foo-bar)',
  },
  {
    command: 'zanza.transformToPascalCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Pascal Case (FooBar)',
  },
  {
    command: 'zanza.transformToSnakeCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Snake Case Proper (foo_bar)',
  },
  {
    command: 'zanza.transformToScreamingSnakeCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Screaming Snake Case (FOO_BAR)',
  },
  {
    command: 'zanza.transformToConstantCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Constant Case (FOO_BAR)',
  },
  {
    command: 'zanza.transformToSentenceCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Sentence Case (Foo bar)',
  },
  {
    command: 'zanza.transformToSentencePascalCase',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Sentence Pascal Case (Foo Bar)',
  },
  {
    command: 'zanza.transformToSplitToWords',
    when: 'editorTextFocus && !editorReadonly',
    title: 'Transform Selection to Split Words (foo bar)',
  },
];
