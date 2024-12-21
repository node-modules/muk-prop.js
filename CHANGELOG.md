# Changelog

## [1.1.0](https://github.com/node-modules/muk-prop.js/compare/v1.0.0...v1.1.0) (2024-12-21)


### Features

* mock property type support symbol and number ([#3](https://github.com/node-modules/muk-prop.js/issues/3)) ([79bf8af](https://github.com/node-modules/muk-prop.js/commit/79bf8afafc55d11ee637b366f752ea0d5c1bca09))

## 1.0.0 (2024-12-20)


### ⚠ BREAKING CHANGES

* drop Node.js < 18.19.0 support

part of https://github.com/eggjs/egg/issues/3644

https://github.com/eggjs/egg/issues/5257

### Features

* add isMocked method to check if the member of the object is mocked ([986493c](https://github.com/node-modules/muk-prop.js/commit/986493cdb97a2af15ac38658ea477583159588cb))
* reset package ([6779edb](https://github.com/node-modules/muk-prop.js/commit/6779edbcfcd12a77c8bff14ef57e6e51a6d58901))
* support cjs and esm both by tshy ([#2](https://github.com/node-modules/muk-prop.js/issues/2)) ([49d3982](https://github.com/node-modules/muk-prop.js/commit/49d39822a6def7007a859a0553b26361ab2c6bee))
* support mock prop with getter setter ([#4](https://github.com/node-modules/muk-prop.js/issues/4)) ([0ba2ae2](https://github.com/node-modules/muk-prop.js/commit/0ba2ae213f110865100dfab3f79978f6c4ac898a))


### Bug Fixes

* can't redefine process.env when node<4 ([7de27b7](https://github.com/node-modules/muk-prop.js/commit/7de27b7975b8dbed30d859b8672ee7811a943600)), closes [nodejs/node#2999](https://github.com/nodejs/node/issues/2999)
* clear mock cache when restore ([790b26c](https://github.com/node-modules/muk-prop.js/commit/790b26c2910e3a197858ab33397f05d96697ea5f))
* hasOwnProperty not found ([5e40063](https://github.com/node-modules/muk-prop.js/commit/5e400632f917f0576dabf446b44004ad5853ebd8))
* muk can mock accessor descriptor now ([73001d7](https://github.com/node-modules/muk-prop.js/commit/73001d7556b827d057e421f649f78eb3aad06508))
* should check process.env ([1cefede](https://github.com/node-modules/muk-prop.js/commit/1cefede9da7a443f25df134bd6baf2094cd686a2))

0.5.1 / 2016-06-12
==================

  * fix: should check process.env
  * fix: can't redefine process.env when node<4

0.5.0 / 2016-06-11
==================

  * feat: add isMocked method to check if the member of the object is mocked

0.4.0 / 2015-09-17
==================

  * Support mocking accessor descriptor
