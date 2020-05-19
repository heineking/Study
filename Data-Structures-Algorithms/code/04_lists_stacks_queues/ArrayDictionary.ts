import { Dictionary, KeyValuePair, List } from './types';
import ArrayList from './ArrayList';

export default class ArrayDictionary<K, T> implements Dictionary<K, T> {

  public static Of<K,T>(): ArrayDictionary<K, T> {
    return new ArrayDictionary<K, T>();
  }

  private xs: List<KeyValuePair<K, T>>;

  get size(): number {
    return this.xs.count;
  }

  private constructor() {
    this.xs = ArrayList.Of<KeyValuePair<K, T>>();
  }

  insert(key: K, item: T): void {
    const kv: KeyValuePair<K, T> = { key, value: item };
    this.xs.push(kv);
  }

  find(key: K): T {
    for (let i = 0; i < this.xs.count; ++i) {
      const kv = this.xs.get(i);
      if (key === kv.key) {
        return kv.value;
      }
    }
  }

  remove(key: K): T {
    const kv = this.find(key);
    if (kv !== undefined) {
      this.xs.remove();
    }
    return kv;
  }

  removeAny(): T {
    if (this.size === 0) {
      throw new RangeError("Dictionary is empty");
    }
    const kv = this.xs.pop(); 
    return kv.value;
  }

  toArray(): Array<[K, T]> {
    const pairs = this.xs.toArray();
    return pairs.map(kv => [kv.key, kv.value]);
  }
}
