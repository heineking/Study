import { Bottom, Top, List, LessThan } from './types';
import insert from './insert';
import toArray from './toArray';

const createSentinals = <T>(): [Top<T>, Bottom<T>] => {
  const top: any = {};
  const bottom: any = {};
  Object.assign(top, { next: bottom, prev: null });
  Object.assign(bottom, { prev: top, next: null});
  return [top, bottom];
};


export const createSortedList = <T>(lt: LessThan<T>): List<T> => {
  const [top, bottom] = createSentinals<T>();
  return {
    insert: (value: T) => insert(value, top, lt),
    toArray: () => toArray(top),
  };
};