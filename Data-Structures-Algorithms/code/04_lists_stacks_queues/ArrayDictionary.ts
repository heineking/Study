import { Dictionary, KeyValuePair, List } from './types';
import { ArrayList } from './ArrayList';

const find = <T>(xs: List<T>, predicate: (item: T) => boolean): [T, List<T>] => {
  xs = xs.reset();
  let next: [T, List<T>];
  while (next = xs.next()) {
    if (predicate(next[0])) {
      return next;
    }
  }
};

export const ArrayDictionary = <K, T>(xs: List<KeyValuePair<K, T>> = ArrayList<KeyValuePair<K, T>>()): Dictionary<K, T> => ({
  size: () => xs.length(),

  insert: (key: K, item: T) => {
    const kv: KeyValuePair<K, T> = { key, value: item };
    return ArrayDictionary(xs.append(kv));
  },

  find: (key: K) => {
    const result = find(xs, kv => kv.key === key);
    if (result) {
      const [item, ys] = result;
      return [item.value, ArrayDictionary(ys)];
    }
  },

  remove: (key: K) => {
    const result = find(xs, kv => kv.key === key);
    if (result) {
      const [item, ys] = result[1].remove();
      return [item.value, ArrayDictionary(ys)];
    }
  },

  removeAny: () => {
    const [item, ys] = xs.remove();
    return [item.value, ArrayDictionary(ys)];
  },

  toArray: () => xs.toArray().map(x => [x.key, x.value]),
});
