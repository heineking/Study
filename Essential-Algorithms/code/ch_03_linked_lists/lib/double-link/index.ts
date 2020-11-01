import { Item, List, Top, Bottom } from './types';
import at from './at';
import insert from './insert';
import push from './push';
import remove from './remove';
import reverse from './reverse';
import unshift from './unshift';
import toArray from './toArray';

export const createList = <T>(): List<T> => {
  const top: Top<T> = { next: null };
  const bottom: Bottom<T> = { prev: null };

  const list: List<T> = {
    at: (index: number) => at(index, top),
    insert: (value: T, after?: Item<T>) => insert(value, top, bottom, after),
    push: (value: T) => push(value, top, bottom),
    remove: (item: Item<T>) => remove(item, top, bottom),
    reverse: () => {
      reverse(top, bottom);
      return list;
    },
    unshift: (value: T) => unshift(value, top, bottom),
    toArray: () => toArray(top),
  };

  return list;
};
