import { Stack, List } from './types';
import { ArrayList } from './ArrayList';

export const ArrayStack = <T>(xs: List<T> = ArrayList<T>()): Stack<T> => ({
  count: () => xs.length(),

  clear: () => ArrayStack(xs.clear()),

  push: (item: T) => ArrayStack<T>(xs.append(item)),

  pop: () => {
    if (xs.length() === 0) {
      return;
    }
    const index = xs.length() - 1;
    const result = xs.at(index).remove();
    if (result) {
      const [value, ys] = result;
      return [value, ArrayStack(ys)];
    }
  },

  peek: () => xs.at(xs.length() - 1).value(), 

  toArray: () => xs.toArray(),
});
