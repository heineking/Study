import { List, Compare } from './types';
import { LinkedList } from './LinkedList';
import { ArrayList } from './ArrayList';

type ListType = 'array' | 'linked';
type Fn<T> = (xs: List<T>) => List<T>;

export const sortedList = <T>(cmp: Compare<T>, xs: List<T>): List<T> => ({
  ...xs,
  insert: (item) => {
    xs = xs.reset();
    let curr = xs.value();
    while (cmp.lt(curr, item)) {
      [curr, xs] = xs.next();
    }
    return sortedList(cmp, xs.insert(item));
  }, 
});

export const createList = <T>(type: ListType, fns: Fn<T>[] = []): List<T> => {
  const xs = type === 'linked' ? LinkedList<T>() : ArrayList<T>();
  return fns.reduce((ys, fn) => fn(ys), xs);
};
