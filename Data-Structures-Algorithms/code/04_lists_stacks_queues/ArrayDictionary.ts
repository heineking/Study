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

// export default class ArrayDictionary<K, T> implements Dictionary<K, T> {

//   public static Of<K,T>(): ArrayDictionary<K, T> {
//     return new ArrayDictionary<K, T>();
//   }

//   private xs: List<KeyValuePair<K, T>>;

//   get size(): number {
//     return this.xs.count;
//   }

//   private constructor() {
//     this.xs = ArrayList.Of<KeyValuePair<K, T>>();
//   }

//   insert(key: K, item: T): void {
//     const kv: KeyValuePair<K, T> = { key, value: item };
//     this.xs.push(kv);
//   }

//   find(key: K): T {
//     for (let i = 0; i < this.xs.count; ++i) {
//       const kv = this.xs.get(i);
//       if (key === kv.key) {
//         return kv.value;
//       }
//     }
//   }

//   remove(key: K): T {
//     const kv = this.find(key);
//     if (kv !== undefined) {
//       this.xs.remove();
//     }
//     return kv;
//   }

//   removeAny(): T {
//     if (this.size === 0) {
//       throw new RangeError("Dictionary is empty");
//     }
//     const kv = this.xs.pop(); 
//     return kv.value;
//   }

//   toArray(): Array<[K, T]> {
//     const pairs = this.xs.toArray();
//     return pairs.map(kv => [kv.key, kv.value]);
//   }
// }
