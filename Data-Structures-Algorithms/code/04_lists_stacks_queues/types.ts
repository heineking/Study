export interface List<T> {
  append(item: T): List<T>;
  at(index: number): List<T>;
  clear(): List<T>;
  insert(item: T): List<T>;
  length(): number;
  next(): [T, List<T>] | null;
  remove(): [T, List<T>];
  reset(): List<T>;
  set(item: T): List<T>;
  toArray(): T[];
  value(): T;
}

export interface Stack<T> {
  count(): number;
  clear(): Stack<T>;
  push(item: T): Stack<T>;
  pop(): [T, Stack<T>];
  peek(): T;
  toArray(): T[];
}

export interface Queue<T> {
  count(): number;
  clear(): Queue<T>;
  enqueue(item: T): Queue<T>;
  dequeue(): [T, Queue<T>];
  peek(): T;
  toArray(): T[];
}

export interface Dictionary<K, T> {
  size(): number;
  insert(key: K, item: T): Dictionary<K, T>;
  find(key: K): T;
  remove(key: K): [T, Dictionary<K, T>];
  removeAny(): [T, Dictionary<K, T>];
  toArray(): Array<[K, T]>;
}

export interface KeyValuePair<K, T> {
  readonly key: K;
  readonly value: T;
}

export interface Compare<T> {
  lt(a: T, b: T): boolean;
  eq(a: T, b: T): boolean;
  gt(a: T, b: T): boolean;
}
