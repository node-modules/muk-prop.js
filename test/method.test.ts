import { strict as assert } from 'node:assert';
import fs from 'node:fs';
import { muk, restore, isMocked, mock } from '../src/index.js';

describe('Mock methods', () => {
  const readFile = fs.readFile;
  const mkdir = fs.mkdir;

  afterEach(restore);

  it('Contains original methods', () => {
    assert.equal(typeof fs.readFile, 'function',
      'fs.readFile is function');
    assert.equal(typeof fs.readFileSync, 'function',
      'fs.readFileSync is function');
  });

  it('Methods are new objects after mocked', () => {
    const readFileMock = (_path: string, callback: any) => {
      process.nextTick(callback.bind(null, null, 'hello!'));
    };

    const mkdirMock = (_path: string, callback: any) => {
      process.nextTick(callback.bind(null, null));
    };

    muk(fs, 'readFile', readFileMock);
    muk(fs, 'mkdir', mkdirMock);
    assert.equal(fs.readFile, readFileMock, 'object method is equal to mock');
    assert.equal(fs.mkdir, mkdirMock, 'object method is equal to mock');
  });

  it('No errors calling new mocked methods', done => {
    const readFileMock = (_path: string, callback: any) => {
      process.nextTick(callback.bind(null, null, 'hello!'));
    };
    muk(fs, 'readFile', readFileMock);

    fs.readFile('grimer', (err, data) => {
      assert.ifError(err);
      assert.equal(data, 'hello!', 'data matches');
      done();
    });
  });

  it('Should have original methods after muk.restore()', () => {
    restore();
    assert.equal(fs.readFile, readFile, 'original method is restored');
    assert.equal(fs.mkdir, mkdir, 'original method is restored');

    const readFileMock = (_path: string, callback: any) => {
      process.nextTick(callback.bind(null, null, 'hello!'));
    };
    muk(fs, 'readFile', readFileMock);
    muk(fs, 'readFile', readFileMock);
    restore();
    assert.equal(fs.readFile, readFile, 'mock twices, original method should be restored too');
  });

  it('Should mock method on prototype', () => {
    const readFile = fs.readFile;
    const newFs = Object.create(fs);
    const readFileMock = (_path: string, callback: any) => {
      process.nextTick(callback.bind(null, null, 'hello!'));
    };
    muk(newFs, 'readFile', readFileMock);
    assert.equal(newFs.readFile, readFileMock, 'object method is equal to mock');

    restore();
    assert.equal(newFs.readFile, readFile, 'object method is equal to origin');
  });
});

describe('Mock property', () => {
  const fooSymbol = Symbol('foo');
  const config = {
    enableCache: true,
    delay: 10,
    [fooSymbol]: 'bar',
    1: 'one',
  };

  const plainObj = Object.create(null);
  plainObj.testKey = 'testValue';

  const home = process.env.HOME;

  afterEach(restore);

  it('Should mock plain object successfully', () => {
    muk(plainObj, 'testKey', 'mockValue');
    assert.equal(plainObj.testKey, 'mockValue', 'testKey is mockValue');
  });

  it('Should mock Symbol property successfully', () => {
    muk(config, fooSymbol, 'mockValue');
    assert.equal(config[fooSymbol], 'mockValue', 'fooSymbol is mockValue');
    assert.equal(isMocked(config, fooSymbol), true, 'fooSymbol is mocked');
    restore();
    assert.equal(config[fooSymbol], 'bar', 'fooSymbol is bar');
    assert.equal(isMocked(config, fooSymbol), false, 'fooSymbol is not mocked');
  });

  it('Should mock number property successfully', () => {
    muk(config, 1, 'mockValue');
    assert.equal(config[1], 'mockValue', '1 is mockValue');
    assert.equal(isMocked(config, 1), true, '1 is mocked');
    restore();
    assert.equal(config[1], 'one', '1 is one');
    assert.equal(isMocked(config, 1), false, '1 is not mocked');
  });

  it('Should alias mock method work', () => {
    mock(plainObj, 'testKey', 'mockValue');
    assert.equal(plainObj.testKey, 'mockValue', 'testKey is mockValue');
  });

  it('Contains original property', () => {
    assert.equal(config.enableCache, true, 'enableCache is true');
    assert.equal(config.delay, 10, 'delay is 10');
  });

  it('Property are new after mocked', () => {
    muk(config, 'enableCache', false);
    muk(config, 'delay', 0);
    muk(process.env, 'HOME', '/mockhome');

    assert.equal(config.enableCache, false, 'enableCache is false');
    assert.equal(config.delay, 0, 'delay is 0');
    assert.equal(process.env.HOME, '/mockhome', 'process.env.HOME is /mockhome');
  });

  it('Should have original properties after muk.restore()', () => {
    muk(config, 'enableCache', false);
    muk(config, 'enableCache', false);
    muk(config, 'delay', 0);
    muk(process.env, 'HOME', '/mockhome');
    muk(config, 'notExistProp', 'value');
    muk(process.env, 'notExistProp', 0);
    assert.deepEqual(Object.keys(config), [ '1', 'enableCache', 'delay', 'notExistProp' ]);

    restore();
    assert.deepEqual(Object.keys(config), [ '1', 'enableCache', 'delay' ]);
    assert.equal(config.enableCache, true, 'enableCache is true');
    assert.equal(config.delay, 10, 'delay is 10');
    assert.equal(process.env.HOME, home, 'process.env.HOME is ' + home);
    assert(!config.hasOwnProperty('notExistProp'), 'notExistProp is deleted');
    assert(!process.env.hasOwnProperty('notExistProp'), 'notExistProp is deleted');
  });

  it('Should be undefined when value is not set', () => {
    muk(config, 'enableCache');
    assert.equal(config.enableCache, undefined, 'enableCache is undefined');
    muk(config, 'enableCache', null);
    assert.equal(config.enableCache, null, 'enableCache is null');
    muk(config, 'enableCache', undefined);
    assert.equal(config.enableCache, undefined, 'enableCache is undefined');
  });

  it('Should mock property on prototype', () => {
    const newConfig = Object.create(config);
    newConfig.enableCache = true;
    muk(newConfig, 'enableCache', false);
    assert.deepEqual(Object.keys(newConfig), [ 'enableCache' ], 'obj should contain properties');
    assert.equal(newConfig.enableCache, false, 'enableCache is false');

    restore();
    assert.equal(newConfig.enableCache, true, 'enableCache is true');
  });
});

describe('Mock getter', () => {
  const obj = {
    get a() {
      return 1;
    },
  };

  afterEach(restore);

  it('Contains original getter', () => {
    assert.equal(obj.a, 1, 'property a of obj is 1');
  });

  it('Methods are new getter after mocked', () => {
    muk(obj, 'a', 2);
    assert.equal(obj.a, 2, 'property a of obj is equal to mock');
  });

  it('Should have original getter after muk.restore()', () => {
    muk(obj, 'a', 2);
    restore();
    assert.equal(obj.a, 1, 'property a of obj is equal to origin');
  });

  it('Should mock property on prototype', () => {
    const newObj = Object.create(obj);
    muk(newObj, 'a', 2);
    assert.deepEqual(Object.keys(newObj), [ 'a' ], 'obj should contain properties');
    assert.equal(newObj.a, 2, 'property a of obj is equal to mock');

    restore();
    assert.equal(newObj.a, 1, 'property a of obj is equal to origin');
  });
});

describe('Mock value with getter', () => {
  const obj = {
    a: 1,
  };

  afterEach(restore);

  it('Value are new getter after mocked', () => {
    muk(obj, 'a', {
      get: () => 2,
    });
    assert.equal(obj.a, 2, 'property a of obj is 2 with getter');
  });

  it('Should throw error when getter', () => {
    muk(obj, 'a', {
      get: () => {
        throw new Error('oh no');
      },
    });

    try {
      obj.a;
    } catch (e) {
      assert(e instanceof Error);
      assert.equal(e.message, 'oh no');
    }
  });

  it('Should have original getter after muk.restore()', () => {
    muk(obj, 'a', {
      get: () => 2,
    });

    restore();
    assert.equal(obj.a, 1, 'property a of obj is equal to original');
  });
});

describe('Mock value with setter', () => {
  const obj = {
    _a: 1,
  } as any;

  Object.defineProperty(obj, 'a', {
    configurable: true,
    set: value => { obj._a = value; },
    get: () => obj._a,
  });

  afterEach(restore);

  it('Value are new setter after mocked', () => {
    muk(obj, 'a', {
      set: (value: any) => { obj._a = value + 1; },
      get: () => obj._a,
    });
    obj.a = 2;
    assert.equal(obj.a, 3, 'property a of obj is 3 with getter');
  });

  it('Should throw error when setter', () => {
    muk(obj, 'a', {
      set: () => {
        throw Error('oh no');
      },
    });

    try {
      obj.a = 2;
    } catch (e: any) {
      assert.equal(e.message, 'oh no');
    }
  });

  it('Should have original setter after muk.restore()', () => {
    muk(obj, 'a', {
      set: (value: number) => { obj._a = value + 1; },
    });

    restore();
    obj.a = 2;
    assert.equal(obj.a, 2, 'property a of obj is equal to original');
  });
});

describe('Mock check', () => {

  afterEach(restore);

  it('Should check whether is mocked', () => {
    const obj = {
      a: 1,
    };
    assert.equal(isMocked(obj, 'a'), false, 'obj should not be mocked');

    muk(obj, 'a', 2);
    assert.ok(isMocked(obj, 'a'), 'obj should be mocked');
  });

  it('Should not be enumerable', () => {
    const obj = {
      a: 1,
    };
    muk(obj, 'a', 2);
    assert.deepEqual(Object.keys(obj), [ 'a' ]);

    const keys = [];
    for (const key in obj) {
      keys.push(key);
    }
    assert.deepEqual(keys, [ 'a' ]);
  });

  it('Should be restored', () => {
    const obj = {
      a: 1,
    };
    muk(obj, 'a', 2);
    assert.equal(isMocked(obj, 'a'), true);
    restore();
    assert.equal(obj.a, 1);
    assert.equal(isMocked(obj, 'a'), false);
  });

  it('Should check different type', () => {
    const obj = {
      a: 1,
      b: '1',
      c: true,
      d: {},
      get e() {
        return 1;
      },
    };
    muk(obj, 'a', 2);
    assert.ok(isMocked(obj, 'a'));

    muk(obj, 'b', '2');
    assert.ok(isMocked(obj, 'b'));

    muk(obj, 'c', false);
    assert.ok(isMocked(obj, 'c'));

    muk(obj, 'd', { d: 1 });
    assert.ok(isMocked(obj, 'd'));

    muk(obj, 'e', 2);
    assert.ok(isMocked(obj, 'e'));
  });

  it('Should check process.env', () => {
    muk(process.env, 'HOME', '/mockhome');
    assert.equal(process.env.HOME, '/mockhome');
    assert.ok(isMocked(process.env, 'HOME'));
  });
});
