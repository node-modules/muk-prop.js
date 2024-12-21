// Keep track of mocks
export interface MockItem {
  obj: any;
  key: PropertyKey;
  descriptor: PropertyDescriptor;
  hasOwnProperty: boolean;
}

let mocks: MockItem[] = [];

const cache = new Map<any, Set<any>>();

/**
 * Mocks a value of an object.
 */
export function mock(obj: any, key: PropertyKey, value?: any) {
  const hasOwnProperty = Object.hasOwn(obj, key);
  mocks.push({
    obj,
    key,
    descriptor: Object.getOwnPropertyDescriptor(obj, key)!,
    // Make sure the key exists on object not the prototype
    hasOwnProperty,
  });

  // Delete the origin key, redefine it below
  if (hasOwnProperty) {
    delete obj[key];
  }

  // Set a flag that checks if it is mocked
  let flag = cache.get(obj);
  if (!flag) {
    flag = new Set();
    cache.set(obj, flag);
  }
  flag.add(key);

  const descriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true,
  };

  if (value && (value.get || value.set)) {
    // Default to undefined
    descriptor.get = value.get;
    descriptor.set = value.set;
  } else {
    // Without getter/setter mode
    descriptor.value = value;
    descriptor.writable = true;
  }

  Object.defineProperty(obj, key, descriptor);
}

// alias to mock
export const muk = mock;

/**
 * Restore all mocks
 */
export function restore() {
  for (let i = mocks.length - 1; i >= 0; i--) {
    const m = mocks[i];
    if (!m.hasOwnProperty) {
      // Delete the mock key, use key on the prototype
      delete m.obj[m.key];
    } else {
      // Redefine the origin key instead of the mock key
      Object.defineProperty(m.obj, m.key, m.descriptor);
    }
  }
  mocks = [];
  cache.clear();
}

export function isMocked(obj: any, key: PropertyKey) {
  const flag = cache.get(obj);
  return flag ? flag.has(key) : false;
}
