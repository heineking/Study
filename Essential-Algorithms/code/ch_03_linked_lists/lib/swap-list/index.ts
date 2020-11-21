import { SwapList, Item } from './types';

import add from './add';
import find from './find';
import toArray from './toArray';

const createSwapList = <T>(): SwapList<T> => {
  const top: Item<T> = {
    next: undefined,
    prev: undefined,
    value: (Symbol() as unknown as T),
  };

  return {
    add: (value) => add(top, value),
    find: (predicate) => find(top, predicate),
    toArray: () => toArray(top),
  };
};

export { createSwapList };
