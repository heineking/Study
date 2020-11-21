import { MtfList, Item } from './types';
import add from './add';
import find from './find';
import toArray from './toArray';

export const createMtfList = <T>(): MtfList<T> => {
  const top: Item<T> = {
    prev: undefined,
    next: undefined,
    value: (Symbol() as unknown as T),
  };

  return {
    add: (value) => add(top, value),
    find: (predicate) => find(top, predicate),
    toArray: () => toArray(top),
  };
};

