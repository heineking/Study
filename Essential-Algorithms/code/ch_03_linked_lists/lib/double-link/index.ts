import { List, Sentinal } from './types';
import unshift from './unshift';
import toArray from './toArray';

export const createList = <T>(): List<T> => {
  const top: Sentinal<T> = { item: null };

  return {
    unshift: (value: T) => unshift(value, top),
    toArray: () => toArray(top),
  };
};
