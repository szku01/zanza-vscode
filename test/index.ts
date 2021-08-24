import { strict as assert } from 'assert';
import { camelCase, kebabCase, pascalCase, screamingSnakeCase, snakeCase } from '../src/changeCase';

assert.equal(kebabCase('Foo Bar'), 'foo-bar');
assert.equal(kebabCase('fooBar'), 'foo-bar');
assert.equal(kebabCase('__FOO_BAR__'), 'foo-bar');

assert.equal(camelCase('Foo Bar'), 'fooBar');
assert.equal(camelCase('--foo-bar--'), 'fooBar');
assert.equal(camelCase('__FOO_BAR__'), 'fooBar');

assert.equal(pascalCase('Foo Bar'), 'FooBar');
assert.equal(pascalCase('--foo-bar--'), 'FooBar');
assert.equal(pascalCase('__FOO_BAR__'), 'FooBar');
assert.equal(pascalCase('--életke-őzike-űrszekerek--'), 'ÉletkeŐzikeŰrszekerek');

assert.equal(snakeCase('Foo Bar'), 'foo_bar');
assert.equal(snakeCase('fooBar'), 'foo_bar');
assert.equal(snakeCase('--FOO-BAR--'), 'foo_bar');
assert.equal(snakeCase('foo2bar'), 'foo_2_bar');

assert.equal(screamingSnakeCase('Foo Bar'), 'FOO_BAR');
assert.equal(screamingSnakeCase('fooBar'), 'FOO_BAR');
assert.equal(screamingSnakeCase('--FOO-BAR--'), 'FOO_BAR');
assert.equal(screamingSnakeCase('foo2bar'), 'FOO_2_BAR');
assert.equal(screamingSnakeCase('életke őzike-űrszekerek'), 'ÉLETKE_ŐZIKE_ŰRSZEKEREK');
