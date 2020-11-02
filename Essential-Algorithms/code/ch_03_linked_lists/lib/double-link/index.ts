import { Item, List, Top, Bottom, Sorter } from './types';
import at from './at';
import insert from './insert';
import push from './push';
import remove from './remove';
import reverse from './reverse';
import unshift from './unshift';
import toArray from './toArray';

export const createSentinals = <T>(): [Top<T>, Bottom<T>] => {
  const top: Partial<Top<T>> = { prev: null };
  const bottom: Bottom<T> = { prev: top as Top<T>, next: null };
  top.next = bottom;
  return [top as Top<T>, bottom];
};

export const createList = <T>(): List<T> => {
  const [top, bottom] = createSentinals<T>();

  const list: List<T> = {
    at: (index: number) => at(index, top),
    insert: (value: T, after?: Item<T>) => insert(value, after || top),
    push: (value: T) => push(value, bottom),
    remove: (item: Item<T>) => remove(item),
    reverse: () => {
      reverse(top, bottom);
      return list;
    },
    sort: (sorter: Sorter<T>) => sorter(top),
    toArray: () => toArray(top),
    unshift: (value: T) => unshift(value, top),
  };

  return list;
};
