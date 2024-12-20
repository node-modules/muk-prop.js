# @cnpmjs/muk-prop

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/node-modules/muk-prop.js/actions/workflows/nodejs.yml/badge.svg)](https://github.com/node-modules/muk-prop.js/actions/workflows/nodejs.yml)
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]
[![Node.js Version](https://img.shields.io/node/v/@cnpmjs/muk-prop.svg?style=flat)](https://nodejs.org/en/download/)

[npm-image]: https://img.shields.io/npm/v/@cnpmjs/muk-prop.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@cnpmjs/muk-prop
[codecov-image]: https://codecov.io/github/node-modules/muk-prop.js/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/node-modules/muk-prop.js?branch=master
[download-image]: https://img.shields.io/npm/dm/@cnpmjs/muk-prop.svg?style=flat-square
[download-url]: https://npmjs.org/package/@cnpmjs/muk-prop

![muk](muk.gif)

## Usage

Object method mocking.

```js
const fs = require('fs');
const { muk } = require('@cnpmjs/muk-prop');

muk(fs, 'readFile', (path, callback) => {
  process.nextTick(callback.bind(null, null, 'file contents here'));
});
```

Object props mocking with setter/getter.

```js
const { muk } = require('@cnpmjs/muk-prop');

const obj = { _a: 1 };
muk(obj, 'a', {
  set: (val) => obj._a = val * 2,
  get: (val) => obj._a,
});

obj.a = 2;
console.log(obj.a); // 4
```

Check if member has been mocked.

```js
const { isMocked } = require('@cnpmjs/muk-prop');

isMocked(fs, 'readFile'); // true
```

Restore all mocked methods/props after tests.

```js
const { restore } = require('@cnpmjs/muk-prop');

fs.readFile(file, (err, data) => {
  // will actually read from `file`
});
```

## Install

```bash
npm install @cnpmjs/muk-prop
```

## Tests

Tests are written with [mocha](https://mochajs.org)

```bash
npm test
```

## Contributors

[![Contributors](https://contrib.rocks/image?repo=node-modules/muk-prop.js)](https://github.com/node-modules/muk-prop.js/graphs/contributors)

Made with [contributors-img](https://contrib.rocks).
