import { Sentinal, Reducer, List } from './types';

import push from './push';
import pop from './pop';
import reduce from './reduce';
import toArray from './toArray';

const createList = <T>(): List<T> => {
  const top: Sentinal<T> = { next: null };
  return {
    push: (value: T) => push(value, top),
    pop: () => pop(top),
    reduce: (reducer: Reducer<T>) => reduce(reducer, top),
    toArray: () => toArray(top),
  };
};

export default createList;
