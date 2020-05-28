import { List, Queue } from './types';
import { ArrayList } from './ArrayList';

export const ArrayQueue = <T>(xs: List<T> = ArrayList<T>()): Queue<T> => ({
  clear: () => ArrayQueue(xs.clear()),
  count: () => xs.length(),
  enqueue: (item: T) => ArrayQueue(xs.append(item)),
  dequeue: () => {
    const [value, ys] = xs.at(0).remove();
    return [value, ArrayQueue(ys)];
  },
  peek: () => xs.value(),
  toArray: () => xs.toArray(),
}); 
