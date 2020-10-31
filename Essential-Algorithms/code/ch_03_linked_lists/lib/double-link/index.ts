import { List, Sentinal } from './types';
import push from './push';
import reverse from './reverse';
import unshift from './unshift';
import toArray from './toArray';

export const createList = <T>(): List<T> => {
  const top: Sentinal<T> = { item: null };
  const bottom: Sentinal<T> = { item: null };

  const list: List<T> = {
    push: (value: T) => push(value, top, bottom),
    reverse: () => {
      reverse(top, bottom);
      return list;
    },
    unshift: (value: T) => unshift(value, top, bottom),
    toArray: () => toArray(top),
  };

  return list;
};
