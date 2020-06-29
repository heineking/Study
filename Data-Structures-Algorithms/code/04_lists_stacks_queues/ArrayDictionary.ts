import { Dictionary, KeyValuePair, List, Compare } from './types';
import { ArrayList } from './ArrayList';

export const find = <T>(xs: List<T>, predicate: (item: T) => boolean): [T, List<T>] => {
  xs = xs.reset();
  let next: [T, List<T>];
  while (next = xs.next()) {
    if (predicate(next[0])) {
      return next;
    }
  }
};

export const binarySearch =  <K, T>(cmp: Compare<K>, xs: List<KeyValuePair<K, T>>, key: K): T => {
  let left = -1, right = xs.length();

  while (left + 1 !== right) {

    const middle = Math.floor((left + right) / 2);

    const kv = xs.at(middle).value();

    if (cmp.lt(key, kv.key)) {
      right = middle;
    }
    else if (cmp.eq(key, kv.key)) {
      return kv.value;
    }
    else if (cmp.gt(key, kv.key)) {
      left = middle;
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
    xs = xs.reset();
    let next: [KeyValuePair<K, T>, List<KeyValuePair<K, T>>];
    while (next = xs.next()) {
      if (next[0].key === key) {
        const [item, ys] = next;
        return  item.value;
      }
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
